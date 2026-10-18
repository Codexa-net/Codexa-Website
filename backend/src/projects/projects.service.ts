import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  CreateProjectStageDto,
  UpdateProjectStageDto,
} from './dto/project-stage.dto';

const SAFE_CLIENT_SELECT = {
  id: true,
  name: true,
  logo: true,
  website: true,
  sector: true,
  category: true,
} as const;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildTechPayload(technologies?: unknown[]) {
    if (!Array.isArray(technologies)) {
      return [];
    }

    return technologies
      .map((technology) => {
        let name = '';

        if (typeof technology === 'string') {
          name = technology.trim();
        } else if (
          technology !== null &&
          typeof technology === 'object' &&
          'name' in technology &&
          typeof (technology as Record<string, any>).name === 'string'
        ) {
          name = (technology as Record<string, any>).name.trim();
        }

        if (!name) {
          return null;
        }

        return {
          where: { name },
          create: {
            name,
            category: 'عام',
            displayOrder: 0,
          },
        };
      })
      .filter(
        (technology): technology is NonNullable<typeof technology> =>
          technology !== null,
      );
  }

  async create(createProjectDto: CreateProjectDto) {
    const { clientId, ...project } = createProjectDto;
    const technologyPayload = this.buildTechPayload(project.technologies);

    let resolvedClientId = clientId;
    if (project.clientEmail && !resolvedClientId) {
      const existingClient = await this.prisma.client.findUnique({
        where: { email: project.clientEmail.trim() },
      });
      if (existingClient) {
        resolvedClientId = existingClient.id;
      }
    }

    return this.prisma.project.create({
      data: {
        name: project.name.trim(),
        slug: this.optionalText(project.slug),
        description: this.optionalText(project.description),
        shortDescription: this.optionalText(project.shortDescription),
        category: this.optionalText(project.category),
        cover: this.optionalText(project.cover),
        liveUrl: this.optionalText(project.liveUrl),
        caseStudyUrl: this.optionalText(project.caseStudyUrl),
        featured: project.featured ?? false,
        displayOrder: project.displayOrder ?? 0,
        watermark: this.optionalText(project.watermark),
        themeClass: this.optionalText(project.themeClass),
        glowColor: this.optionalText(project.glowColor),
        year: this.optionalText(project.year),
        services: this.optionalText(project.services),
        managerName: this.optionalText(project.managerName),
        designerName: this.optionalText(project.designerName),
        status: project.status?.trim() || 'قيد التنفيذ',
        priority: project.priority?.trim() || 'متوسطة',
        progress: project.progress ?? 0,
        deadline: this.optionalText(project.deadline),
        isPublic: project.isPublic ?? false,
        clientEmail: this.optionalText(project.clientEmail),
        ...(resolvedClientId
          ? {
              client: {
                connect: { id: resolvedClientId },
              },
            }
          : {}),
        ...(technologyPayload.length > 0
          ? {
              technologies: {
                connectOrCreate: technologyPayload,
              },
            }
          : {}),
      },
      include: {
        client: { select: SAFE_CLIENT_SELECT },
        technologies: true,
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAll(query: ListProjectsQueryDto) {
    const search = query.search?.trim();
    const where: Prisma.ProjectWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (query.status?.trim()) {
      where.status = query.status.trim();
    }

    if (query.clientId?.trim()) {
      where.clientId = query.clientId.trim();
    }

    if (typeof query.featured === 'boolean') {
      where.featured = query.featured;
    }

    // منطق العرض العام: لا يُعرض في المعرض إلا المشاريع المكتملة والمحددة كـ public
    if ((query as any).isPublic !== undefined) {
      const isPublicRequested =
        (query as any).isPublic === 'true' || (query as any).isPublic === true;
      if (isPublicRequested) {
        where.isPublic = true;
        where.status = 'مكتمل';
      } else {
        where.isPublic = false;
      }
    }

    return this.prisma.project.findMany({
      where,
      include: {
        client: { select: SAFE_CLIENT_SELECT },
        technologies: true,
        stages: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: SAFE_CLIENT_SELECT },
        technologies: true,
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);
    const { clientId, ...project } = updateProjectDto;
    const data: Prisma.ProjectUpdateInput = {};

    if (project.name !== undefined) data.name = project.name.trim();
    if (project.slug !== undefined) data.slug = this.optionalText(project.slug);
    if (project.description !== undefined) data.description = this.optionalText(project.description);
    if (project.shortDescription !== undefined) data.shortDescription = this.optionalText(project.shortDescription);
    if (project.category !== undefined) data.category = this.optionalText(project.category);
    if (project.cover !== undefined) data.cover = this.optionalText(project.cover);
    if (project.liveUrl !== undefined) data.liveUrl = this.optionalText(project.liveUrl);
    if (project.caseStudyUrl !== undefined) data.caseStudyUrl = this.optionalText(project.caseStudyUrl);
    if (project.featured !== undefined) data.featured = project.featured;
    if (project.displayOrder !== undefined) data.displayOrder = project.displayOrder;
    if (project.watermark !== undefined) data.watermark = this.optionalText(project.watermark);
    if (project.themeClass !== undefined) data.themeClass = this.optionalText(project.themeClass);
    if (project.glowColor !== undefined) data.glowColor = this.optionalText(project.glowColor);
    if (project.year !== undefined) data.year = this.optionalText(project.year);
    if (project.services !== undefined) data.services = this.optionalText(project.services);
    if (project.managerName !== undefined) data.managerName = this.optionalText(project.managerName);
    if (project.designerName !== undefined) data.designerName = this.optionalText(project.designerName);
    if (project.status !== undefined) data.status = project.status.trim();
    if (project.priority !== undefined) data.priority = project.priority.trim();
    if (project.progress !== undefined) data.progress = project.progress;
    if (project.deadline !== undefined) data.deadline = this.optionalText(project.deadline);
    if (project.isPublic !== undefined) data.isPublic = project.isPublic;
    if (project.clientEmail !== undefined) data.clientEmail = this.optionalText(project.clientEmail);

    let resolvedClientId = clientId;
    if (project.clientEmail !== undefined && !resolvedClientId) {
      const emailToSearch = this.optionalText(project.clientEmail);
      if (emailToSearch) {
        const existingClient = await this.prisma.client.findUnique({
          where: { email: emailToSearch },
        });
        if (existingClient) {
          resolvedClientId = existingClient.id;
        }
      }
    }

    if (resolvedClientId !== undefined) {
      data.client = resolvedClientId
        ? { connect: { id: resolvedClientId } }
        : { disconnect: true };
    } else if (clientId !== undefined) {
      data.client = clientId ? { connect: { id: clientId } } : { disconnect: true };
    }

    if (project.technologies !== undefined) {
      const technologyPayload = this.buildTechPayload(project.technologies);
      data.technologies = {
        set: [],
        connectOrCreate: technologyPayload,
      };
    }

    return this.prisma.project.update({
      where: { id },
      data,
      include: {
        client: { select: SAFE_CLIENT_SELECT },
        technologies: true,
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });

    return {
      message: 'Project deleted successfully.',
      data: { id },
    };
  }

  async addStage(projectId: string, dto: CreateProjectStageDto) {
    await this.findOne(projectId);

    return this.prisma.projectStage.create({
      data: {
        projectId,
        title: dto.title.trim(),
        order: dto.order ?? 0,
        assignedTo: this.optionalText(dto.assignedTo),
        progress: dto.progress ?? 0,
        isCompleted: dto.isCompleted ?? false,
      },
    });
  }

  async updateStage(stageId: string, dto: UpdateProjectStageDto) {
    const stage = await this.prisma.projectStage.findUnique({
      where: { id: stageId },
    });

    if (!stage) {
      throw new NotFoundException('Stage not found.');
    }

    return this.prisma.projectStage.update({
      where: { id: stageId },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.order !== undefined ? { order: dto.order } : {}),
        ...(dto.assignedTo !== undefined ? { assignedTo: this.optionalText(dto.assignedTo) } : {}),
        ...(dto.progress !== undefined ? { progress: dto.progress } : {}),
        ...(dto.isCompleted !== undefined ? { isCompleted: dto.isCompleted } : {}),
      },
    });
  }

  async removeStage(stageId: string) {
    const stage = await this.prisma.projectStage.findUnique({
      where: { id: stageId },
    });

    if (!stage) {
      throw new NotFoundException('Stage not found.');
    }

    await this.prisma.projectStage.delete({
      where: { id: stageId },
    });

    return {
      message: 'Stage deleted successfully.',
      data: { id: stageId },
    };
  }

  private optionalText(value?: string | null) {
    const trimmed = value?.trim();
    return trimmed || null;
  }
}