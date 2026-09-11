import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * تجهيز التقنيات القادمة من الواجهة.
   *
   * يدعم الشكلين:
   * - ["React", "NestJS"]
   * - [{ name: "React" }, { name: "NestJS" }]
   */
  private buildTechPayload(technologies?: unknown[]) {
    if (!Array.isArray(technologies)) {
      return [];
    }

    return technologies
      .map((technology) => {
        const name =
          typeof technology === 'string'
            ? technology.trim()
            : technology &&
                typeof technology === 'object' &&
                'name' in technology &&
                typeof technology.name === 'string'
              ? technology.name.trim()
              : '';

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
        (
          technology,
        ): technology is {
          where: { name: string };
          create: {
            name: string;
            category: string;
            displayOrder: number;
          };
        } => technology !== null,
      );
  }

  async create(createProjectDto: CreateProjectDto) {
    const { clientId, ...project } = createProjectDto;

    const technologyPayload = this.buildTechPayload(project.technologies);

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

        ...(clientId
          ? {
              client: {
                connect: {
                  id: clientId,
                },
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
        client: true,
        technologies: true,
      },
    });
  }

  async findAll(query: ListProjectsQueryDto) {
    const search = query.search?.trim();

    const where: Prisma.ProjectWhereInput = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          category: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          client: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
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

    return this.prisma.project.findMany({
      where,

      include: {
        client: true,
        technologies: true,
      },

      orderBy: [
        {
          displayOrder: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },

      include: {
        client: true,
        technologies: true,
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

    if (project.name !== undefined) {
      data.name = project.name.trim();
    }

    if (project.slug !== undefined) {
      data.slug = this.optionalText(project.slug);
    }

    if (project.description !== undefined) {
      data.description = this.optionalText(project.description);
    }

    if (project.shortDescription !== undefined) {
      data.shortDescription = this.optionalText(project.shortDescription);
    }

    if (project.category !== undefined) {
      data.category = this.optionalText(project.category);
    }

    if (project.cover !== undefined) {
      data.cover = this.optionalText(project.cover);
    }

    if (project.liveUrl !== undefined) {
      data.liveUrl = this.optionalText(project.liveUrl);
    }

    if (project.caseStudyUrl !== undefined) {
      data.caseStudyUrl = this.optionalText(project.caseStudyUrl);
    }

    if (project.featured !== undefined) {
      data.featured = project.featured;
    }

    if (project.displayOrder !== undefined) {
      data.displayOrder = project.displayOrder;
    }

    if (project.watermark !== undefined) {
      data.watermark = this.optionalText(project.watermark);
    }

    if (project.themeClass !== undefined) {
      data.themeClass = this.optionalText(project.themeClass);
    }

    if (project.glowColor !== undefined) {
      data.glowColor = this.optionalText(project.glowColor);
    }

    if (project.year !== undefined) {
      data.year = this.optionalText(project.year);
    }

    if (project.services !== undefined) {
      data.services = this.optionalText(project.services);
    }

    if (project.managerName !== undefined) {
      data.managerName = this.optionalText(project.managerName);
    }

    if (project.designerName !== undefined) {
      data.designerName = this.optionalText(project.designerName);
    }

    if (project.status !== undefined) {
      data.status = project.status.trim();
    }

    if (project.priority !== undefined) {
      data.priority = project.priority.trim();
    }

    if (project.progress !== undefined) {
      data.progress = project.progress;
    }

    if (project.deadline !== undefined) {
      data.deadline = this.optionalText(project.deadline);
    }

    if (clientId !== undefined) {
      data.client = clientId
        ? {
            connect: {
              id: clientId,
            },
          }
        : {
            disconnect: true,
          };
    }

    /**
     * عند إرسال التقنيات أثناء التعديل:
     * - set: [] يحذف التقنيات القديمة من العلاقة فقط.
     * - connectOrCreate يضيف التقنيات الجديدة.
     * لا يتم حذف سجلات Technology نفسها من قاعدة البيانات.
     */
    if (project.technologies !== undefined) {
      const technologyPayload = this.buildTechPayload(
        project.technologies,
      );

      data.technologies = {
        set: [],
        connectOrCreate: technologyPayload,
      };
    }

    return this.prisma.project.update({
      where: { id },
      data,

      include: {
        client: true,
        technologies: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.project.delete({
      where: { id },
    });

    return {
      message: 'Project deleted successfully.',
      data: { id },
    };
  }

  private optionalText(value?: string | null) {
    const trimmed = value?.trim();

    return trimmed || null;
  }
}