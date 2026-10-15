import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  track: true,
  phone: true,
  avatar: true,
  cvUrl: true,
  instaPay: true,
  walletNumber: true,
  walletBalance: true,
  technologies: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
  }

  findActiveById(id: string) {
    return (this.prisma.adminUser as any).findFirst({
      where: { id, isActive: true },
      select: {
        ...PUBLIC_USER_SELECT,
        passwordHash: false,
      },
    });
  }

  async findAll() {
    return (this.prisma.adminUser as any).findMany({
      select: {
        ...PUBLIC_USER_SELECT,
        passwordHash: false,
        assignedStages: {
          select: {
            id: true,
            title: true,
            progress: true,
            isUnderReview: true,
            isApproved: true,
            reward: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    track?: any;
    phone?: string;
    cvUrl?: string;
    instaPay?: string;
    walletNumber?: string;
    technologies?: string[];
  }) {
    const email = data.email.trim().toLowerCase();
    const existing = await this.findByEmail(email);

    if (existing) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل.');
    }

    if (!data.password || data.password.length < 6) {
      throw new BadRequestException('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_ROUNDS ?? 12),
    );

    return (this.prisma.adminUser as any).create({
      data: {
        name: data.name.trim(),
        email,
        passwordHash,
        role: data.role,
        track: data.track ? data.track : null,
        phone: data.phone?.trim() || null,
        cvUrl: data.cvUrl || null,
        instaPay: data.instaPay?.trim() || null,
        walletNumber: data.walletNumber?.trim() || null,
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        isActive: true,
      },
      select: {
        ...PUBLIC_USER_SELECT,
        passwordHash: false,
      },
    });
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      track?: any;
      phone?: string;
      avatar?: string;
      cvUrl?: string;
      instaPay?: string;
      walletNumber?: string;
      technologies?: string[];
      isActive?: boolean;
    },
    isSuperAdmin = false,
  ) {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود.');
    }

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.phone !== undefined) updateData.phone = data.phone.trim() || null;
    if (data.avatar !== undefined) updateData.avatar = data.avatar || null;
    if (data.cvUrl !== undefined) updateData.cvUrl = data.cvUrl || null;
    if (data.instaPay !== undefined) updateData.instaPay = data.instaPay?.trim() || null;
    if (data.walletNumber !== undefined) updateData.walletNumber = data.walletNumber?.trim() || null;
    if (data.technologies !== undefined) updateData.technologies = data.technologies;

    if (isSuperAdmin) {
      if (data.role !== undefined) updateData.role = data.role;
      if (data.track !== undefined) updateData.track = data.track;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
    }

    if (data.email !== undefined) {
      const email = data.email.trim().toLowerCase();
      if (email !== user.email) {
        const emailOwner = await this.findByEmail(email);
        if (emailOwner && emailOwner.id !== id) {
          throw new ConflictException('البريد الإلكتروني مستخدم بالفعل من مستخدم آخر.');
        }
      }
      updateData.email = email;
    }

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(
        data.password,
        Number(process.env.BCRYPT_ROUNDS ?? 12),
      );
    }

    return (this.prisma.adminUser as any).update({
      where: { id },
      data: updateData,
      select: {
        ...PUBLIC_USER_SELECT,
        passwordHash: false,
      },
    });
  }

  async updateProfile(
    id: string,
    data: {
      name?: string;
      phone?: string;
      avatar?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ) {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود.');
    }

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.phone !== undefined) updateData.phone = data.phone.trim() || null;
    if (data.avatar !== undefined) updateData.avatar = data.avatar || null;

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new BadRequestException('يجب إدخال كلمة المرور الحالية أولاً.');
      }

      const valid = await bcrypt.compare(
        data.currentPassword,
        user.passwordHash,
      );

      if (!valid) {
        throw new BadRequestException('كلمة المرور الحالية غير صحيحة.');
      }

      updateData.passwordHash = await bcrypt.hash(
        data.newPassword,
        Number(process.env.BCRYPT_ROUNDS ?? 12),
      );
    }

    return (this.prisma.adminUser as any).update({
      where: { id },
      data: updateData,
      select: {
        ...PUBLIC_USER_SELECT,
        passwordHash: false,
      },
    });
  }

  async deleteUser(id: string, requesterId: string) {
    if (id === requesterId) {
      throw new BadRequestException('لا يمكنك حذف حسابك الحالي.');
    }

    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('المستخدم غير موجود.');

    if (String(user.role) === 'SUPER_ADMIN') {
      const superAdminCount = await this.prisma.adminUser.count({
        where: { role: 'SUPER_ADMIN' as any, isActive: true },
      });

      if (superAdminCount <= 1) {
        throw new BadRequestException('يجب أن يبقى Super Admin فعال واحد على الأقل.');
      }
    }

    await this.prisma.adminUser.delete({ where: { id } });
    return { success: true, message: 'تم حذف المستخدم بنجاح.' };
  }

  updateLastLogin(id: string) {
    return this.prisma.adminUser.update({
      where: { id },
      data: { lastLoginAt: new Date() },
      select: { id: true, lastLoginAt: true },
    });
  }

  async getTransactions(userId: string) {
    return (this.prisma as any).walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addTransaction(
    userId: string,
    data: { type: string; amount: number; description: string; receiptNo?: string },
  ) {
    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('المستخدم غير موجود');

    const numAmount = Number(data.amount);
    let balanceChange = 0;
    let withdrawnChange = 0;

    if (data.type === 'BONUS' || data.type === 'TASK_REWARD') {
      balanceChange = Math.abs(numAmount);
    } else if (data.type === 'DEDUCTION') {
      balanceChange = -Math.abs(numAmount);
    } else if (data.type === 'WITHDRAWAL') {
      balanceChange = -Math.abs(numAmount);
      withdrawnChange = Math.abs(numAmount);
    }

    const [transaction, updatedUser] = await this.prisma.$transaction([
      (this.prisma as any).walletTransaction.create({
        data: {
          userId,
          type: data.type,
          amount:
            data.type === 'DEDUCTION' || data.type === 'WITHDRAWAL'
              ? -Math.abs(numAmount)
              : Math.abs(numAmount),
          description: data.description.trim(),
          receiptNo: data.receiptNo?.trim() || null,
        },
      }),
      this.prisma.adminUser.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: balanceChange },
          totalWithdrawn: { increment: withdrawnChange },
        },
      }),
    ]);

    return { transaction, updatedUser };
  }
}