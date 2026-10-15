import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateProjectStageDto } from './dto/create-project-stage.dto';
import { UpdateProjectStageDto } from './dto/update-project-stage.dto';

@Injectable()
export class ProjectStagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // 1. إنشاء مهمة وإرسال إشعار داخلي + بريد إلكتروني للمنفذ
  async create(createDto: CreateProjectStageDto) {
    const stage = await this.prisma.projectStage.create({
      data: {
        projectId: createDto.projectId,
        title: createDto.title,
        description: createDto.description,
        track: createDto.track,
        assignedUserId: createDto.assignedUserId,
        assignedTo: createDto.assignedTo,
        deadline: createDto.deadline,
        reward: createDto.reward ? Number(createDto.reward) : 0,
        figmaUrl: createDto.figmaUrl,
        feedback: createDto.feedback,
        order: 0,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    if (stage.assignedUserId) {
      await this.prisma.notification
        .create({
          data: {
            userId: stage.assignedUserId,
            title: '📋 مهمة جديدة بانتظارك',
            message: `تم إسناد مهمة "${stage.title}" في مشروع "${stage.project.name}" بمكافأة قدرها ${stage.reward} ج.م`,
            link: '/dashboard/tasks',
            type: 'TASK',
          },
        })
        .catch(() => null);

      if (stage.assignedUser?.email) {
        this.mailService
          .sendTaskAssigned(stage.assignedUser.email, {
            taskTitle: stage.title,
            projectName: stage.project.name,
            deadline: stage.deadline
              ? new Date(stage.deadline).toLocaleDateString('ar-EG')
              : undefined,
            reward: Number(stage.reward) || undefined,
            taskId: stage.id,
          })
          .catch((err) => console.error('فشل إرسال إيميل إسناد المهمة:', err));
      }
    }

    return stage;
  }

  async findAll() {
    return this.prisma.projectStage.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { id: true, name: true } },
        assignedUser: { select: { id: true, name: true, role: true } },
      },
    });
  }

  async findOne(id: string) {
    const stage = await this.prisma.projectStage.findUnique({
      where: { id },
      include: {
        assignedUser: true,
        project: true,
      },
    });
    if (!stage) throw new NotFoundException('المهمة غير موجودة');
    return stage;
  }

  async findMyTasks(userId: string) {
    return this.prisma.projectStage.findMany({
      where: { assignedUserId: userId },
      include: {
        project: {
          select: { id: true, name: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProject(projectId: string) {
    return this.prisma.projectStage.findMany({
      where: { projectId },
      include: {
        assignedUser: {
          select: { id: true, name: true, role: true, phone: true, cvUrl: true },
        },
      },
      orderBy: [{ track: 'asc' }, { order: 'asc' }],
    });
  }

  // 2. تحديث نسبة الإنجاز والتسليم 100% وإشعار المشرفين بالإيميل
  async updateProgress(
    id: string,
    progress: number,
    isCompleted?: boolean,
    reply?: string,
    deliverableUrl?: string,
  ) {
    const stage = await this.prisma.projectStage.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        assignedUser: { select: { id: true, name: true, role: true, email: true } },
      },
    });
    if (!stage) throw new NotFoundException('المهمة غير موجودة');

    const numericProgress = Math.min(100, Math.max(0, Number(progress) || 0));
    const isUnderReview = numericProgress === 100 && !stage.isApproved;
    const completed =
      isCompleted !== undefined
        ? Boolean(isCompleted)
        : stage.isApproved && numericProgress === 100;

    const updateData: Record<string, any> = {
      progress: numericProgress,
      isUnderReview,
      isCompleted: completed,
    };

    if (reply?.trim() || deliverableUrl?.trim()) {
      const parts: string[] = [];
      if (stage.feedback) {
        parts.push(`📌 ملاحظات المشرف:\n${stage.feedback}`);
      }
      if (reply?.trim()) {
        parts.push(`💬 رد وتوضيح المنفذ:\n${reply.trim()}`);
      }
      if (deliverableUrl?.trim()) {
        parts.push(`🔗 رابط التسليم:\n${deliverableUrl.trim()}`);
      }
      updateData.feedback = parts.join('\n\n---\n\n');
    }

    const updated = await this.prisma.projectStage.update({
      where: { id },
      data: updateData,
    });

    if (isUnderReview && !stage.isUnderReview) {
      try {
        const leadersAndAdmins = await this.prisma.adminUser.findMany({
          where: {
            OR: [
              { role: 'SUPER_ADMIN' },
              { role: `${stage.track}_LEAD` as any },
            ],
            isActive: true,
          },
        });

        const memberName =
          stage.assignedUser?.name || stage.assignedTo || 'أحد أعضاء الفريق';
        const replyNote = reply?.trim() ? `\n(توضيح المنفذ: "${reply.trim()}")` : '';

        for (const leader of leadersAndAdmins) {
          await this.prisma.notification.create({
            data: {
              userId: leader.id,
              title: '🚀 تسليم مهمة بانتظار المراجعة',
              message: `قام ${memberName} بتسليم مهمة "${stage.title}" بنسبة 100% في مشروع "${stage.project.name}".${replyNote}`,
              link: '/dashboard/tasks',
              type: 'TASK',
            },
          });

          if (leader.email) {
            this.mailService
              .sendTaskSubmitted(leader.email, {
                taskTitle: stage.title,
                projectName: stage.project.name,
                executorName: memberName,
                deliverableUrl: deliverableUrl?.trim(),
                executorNotes: reply?.trim(),
              })
              .catch((err) => console.error('فشل إرسال إيميل التسليم:', err));
          }
        }
      } catch (err) {
        console.error('فشل إرسال إشعار التسليم لليدر:', err);
      }
    }

    return updated;
  }

  // 3. طلب تعديلات وملاحظات وإشعار المنفذ بالإيميل
  async requestChanges(id: string, feedback: string) {
    const stage = await this.prisma.projectStage.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        assignedUser: true,
      },
    });
    if (!stage) throw new NotFoundException('المهمة غير موجودة');

    const updated = await this.prisma.projectStage.update({
      where: { id },
      data: {
        isUnderReview: false,
        isCompleted: false,
        isLeadApproved: false,
        progress: 80,
        feedback: feedback.trim(),
      },
    });

    if (stage.assignedUserId) {
      await this.prisma.notification
        .create({
          data: {
            userId: stage.assignedUserId,
            title: '⚠️ طلب تعديلات وملاحظات على مهمتك',
            message: `أرسل قائد الفريق ملاحظات على مهمة "${stage.title}" في مشروع "${stage.project.name}":\n"${feedback.trim()}"`,
            link: '/dashboard/tasks',
            type: 'TASK',
          },
        })
        .catch(() => null);

      if (stage.assignedUser?.email) {
        this.mailService
          .sendChangesRequested(stage.assignedUser.email, {
            taskTitle: stage.title,
            projectName: stage.project.name,
            feedback: feedback.trim(),
          })
          .catch((err) => console.error('فشل إرسال إيميل الملاحظات:', err));
      }
    }

    return updated;
  }

  // 4. الاعتماد الفني لليدر
  async leadApprove(stageId: string, currentUser?: any) {
    const stage = await this.prisma.projectStage.findUnique({
      where: { id: stageId },
      include: { project: true, assignedUser: true },
    });
    if (!stage) throw new NotFoundException('المهمة غير موجودة');

    const role = currentUser?.role?.toUpperCase();
    if (role && role !== 'SUPER_ADMIN' && role !== `${stage.track}_LEAD`) {
      throw new ForbiddenException('غير مصرح لك باعتماد مهام هذا القسم فنياً');
    }

    const updated = await this.prisma.projectStage.update({
      where: { id: stageId },
      data: {
        isLeadApproved: true,
        isUnderReview: false,
        isCompleted: true,
        progress: 100,
        feedback: null,
      },
    });

    try {
      const superAdmins = await this.prisma.adminUser.findMany({
        where: { role: 'SUPER_ADMIN', isActive: true },
      });
      for (const admin of superAdmins) {
        await this.prisma.notification.create({
          data: {
            userId: admin.id,
            title: '✅ مهمة معتمدة فنياً بانتظار الصرف',
            message: `اعتمد ليدر قسم ${stage.track} مهمة "${stage.title}" فنياً في مشروع "${stage.project.name}". يرجى تأكيد الصرف المالي.`,
            link: '/dashboard/tasks',
            type: 'TASK',
          },
        });

        if (admin.email) {
          this.mailService
            .sendTechnicalApproved(admin.email, {
              taskTitle: stage.title,
              projectName: stage.project.name,
              executorName: stage.assignedUser?.name || 'المنفذ',
              reward: Number(stage.reward) || 0,
            })
            .catch((err) => console.error('فشل إرسال إيميل الاعتماد الفني:', err));
        }
      }
    } catch (e) {
      console.error(e);
    }

    return updated;
  }

  // 5. الصرف والاعتماد المالي وإرسال إيميل إيداع الأرباح للمنفذ
  async adminPayout(stageId: string, currentUser?: any) {
    if (currentUser?.role && currentUser.role.toUpperCase() !== 'SUPER_ADMIN') {
      throw new ForbiddenException('صلاحية صرف المكافآت المالية مقتصرة على مدير النظام فقط');
    }

    const stage = await this.prisma.projectStage.findUnique({
      where: { id: stageId },
      include: { assignedUser: true, project: true },
    });
    if (!stage) throw new NotFoundException('المهمة غير موجودة');
    if (stage.isPaid) throw new BadRequestException('تم صرف مستحقات هذه المهمة مسبقاً');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.projectStage.update({
        where: { id: stageId },
        data: {
          isApproved: true,
          isLeadApproved: true,
          isPaid: true,
          isUnderReview: false,
          isCompleted: true,
          progress: 100,
          feedback: null,
        },
      });

      if (stage.assignedUserId && stage.reward > 0) {
        const updatedUser = await tx.adminUser.update({
          where: { id: stage.assignedUserId },
          data: {
            walletBalance: { increment: stage.reward },
          },
        });

        await tx.walletTransaction.create({
          data: {
            userId: stage.assignedUserId,
            amount: stage.reward,
            type: 'TASK_REWARD',
            description: `مكافأة إنجاز مهمة: ${stage.title}`,
            projectId: stage.projectId,
            stageId: stage.id,
            receiptNo: `REC-${Date.now().toString().slice(-6)}`,
          },
        });

        await tx.notification.create({
          data: {
            userId: stage.assignedUserId,
            title: '🎉 تم تحويل أرباح ومستحقات المهمة!',
            message: `ألف مبروك! تم اعتماد مهمة "${stage.title}" رسمياً وإيداع ${stage.reward} ج.م في محفظتك.`,
            link: '/dashboard/wallet',
            type: 'WALLET',
          },
        });

        if (stage.assignedUser?.email) {
          this.mailService
            .sendPayoutDeposited(stage.assignedUser.email, {
              taskTitle: stage.title,
              amount: Number(stage.reward),
              balance: Number(updatedUser.walletBalance) || Number(stage.reward),
            })
            .catch((err) => console.error('فشل إرسال إيميل الصرف المالي:', err));
        }
      }

      const remainingUnapproved = await tx.projectStage.count({
        where: {
          projectId: stage.projectId,
          track: stage.track,
          isApproved: false,
          id: { not: stage.id },
        },
      });

      if (remainingUnapproved === 0) {
        await this.handlePipelineHandoff(tx, stage.track, stage.project.name);
      }

      return updated;
    });
  }

  // 6. إلغاء إسناد المهمة وإعادتها متاحة
  async unassignTask(stageId: string, currentUser?: any) {
    const stage = await this.prisma.projectStage.findUnique({
      where: { id: stageId },
      include: { project: true, assignedUser: true },
    });
    if (!stage) throw new NotFoundException('المهمة غير موجودة');

    const role = currentUser?.role?.toUpperCase();
    if (
      role &&
      role !== 'SUPER_ADMIN' &&
      role !== `${stage.track}_LEAD` &&
      role !== 'SALES_LEADER'
    ) {
      throw new ForbiddenException('غير مصرح لك بإلغاء إسناد هذه المهمة');
    }

    if (stage.isPaid) {
      throw new BadRequestException('لا يمكن إلغاء إسناد مهمة تم صرف مستحقاتها المالية بالفعل');
    }

    const previousUserId = stage.assignedUserId;

    const updated = await this.prisma.projectStage.update({
      where: { id: stageId },
      data: {
        assignedUserId: null,
        assignedTo: null,
        isUnderReview: false,
        isLeadApproved: false,
        progress: 0,
        feedback: null,
      },
    });

    if (previousUserId) {
      await this.prisma.notification
        .create({
          data: {
            userId: previousUserId,
            title: 'ℹ️ تم إلغاء إسناد المهمة',
            message: `تم إلغاء تكليفك بمهمة "${stage.title}" في مشروع "${stage.project?.name || ''}".`,
            link: '/dashboard/tasks',
            type: 'TASK',
          },
        })
        .catch(() => null);
    }

    return updated;
  }

  async approveStage(id: string) {
    return this.adminPayout(id, { role: 'SUPER_ADMIN' });
  }

  async advanceProjectStage(projectId: string, nextStage: any, currentUser?: any) {
    if (currentUser?.role && currentUser.role.toUpperCase() !== 'SUPER_ADMIN') {
      throw new ForbiddenException('صلاحية نقل مراحل المشروع لمدير النظام فقط');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: { currentStage: nextStage },
    });
  }

  private async handlePipelineHandoff(
    tx: any,
    completedTrack: string,
    projectName: string,
  ) {
    try {
      let targetRoles: string[] = [];
      let message = '';

      if (completedTrack === 'UI_UX') {
        targetRoles = ['BACKEND_LEAD', 'SUPER_ADMIN'];
        message = `🎨 تم اكتمال واعتماد تصاميم الواجهات (UI/UX) لمشروع "${projectName}" بنسبة 100%! أصبحت التصاميم جاهزة، ويمكن لفريق الأنظمة الخلفية (Backend) البدء الآن.`;
      } else if (completedTrack === 'BACKEND') {
        targetRoles = ['FRONTEND_LEAD', 'MOBILE_APP_LEAD', 'SUPER_ADMIN'];
        message = `⚙ تم اكتمال واعتماد الأنظمة والـ APIs لمشروع "${projectName}" بنسبة 100%! يمكن الآن لفريقي تطوير الواجهات (Frontend) وتطبيقات الموبايل البدء في ربط الشاشات.`;
      }

      if (targetRoles.length > 0) {
        const usersToNotify = await tx.adminUser.findMany({
          where: { role: { in: targetRoles as any }, isActive: true },
        });

        for (const u of usersToNotify) {
          await tx.notification.create({
            data: {
              userId: u.id,
              title: '🚀 مرحلة جديدة جاهزة للبدء',
              message,
              link: '/dashboard/tasks',
              type: 'TASK',
            },
          });
        }
      }
    } catch (e) {
      console.error('Pipeline notification error:', e);
    }
  }

  async update(id: string, updateDto: UpdateProjectStageDto) {
    return this.prisma.projectStage.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.projectStage.delete({
      where: { id },
    });
  }
}