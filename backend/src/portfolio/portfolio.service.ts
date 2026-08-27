import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // Projects
  // =========================

  async createProject(dto: CreateProjectDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: dto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    const technologies = await this.prisma.technology.findMany({
      where: {
        id: {
          in: dto.technologyIds,
        },
      },
    });

    if (technologies.length !== dto.technologyIds.length) {
      throw new NotFoundException('One or more technologies not found.');
    }

    try {
      return await this.prisma.project.create({
        data: {
          title: dto.title.trim(),
          slug: dto.slug.trim().toLowerCase(),
          description: dto.description.trim(),
          imageUrl: dto.imageUrl?.trim() || null,
          githubUrl: dto.githubUrl?.trim() || null,
          liveUrl: dto.liveUrl?.trim() || null,
          isFeatured: dto.isFeatured ?? false,
          category: {
            connect: {
              id: dto.categoryId,
            },
          },
          technologies: {
            connect: dto.technologyIds.map((id) => ({ id })),
          },
        },
        include: {
          category: true,
          technologies: true,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A project with the same slug already exists.',
        );
      }

      throw error;
    }
  }

  async findAllProjects(query: ListProjectsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const where: Prisma.ProjectWhereInput = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          slug: {
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
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          technologies: {
            some: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.technologyId) {
      where.technologies = {
        some: {
          id: query.technologyId,
        },
      };
    }

    if (typeof query.featured === 'boolean') {
      where.isFeatured = query.featured;
    }

    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: {
          category: true,
          technologies: true,
        },
        orderBy: [
          {
            isFeatured: 'desc',
          },
          {
            createdAt: 'desc',
          },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.project.count({
        where,
      }),
    ]);

    return {
      data: projects,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findProjectById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        technologies: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return project;
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    await this.findProjectById(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found.');
      }
    }

    if (dto.technologyIds) {
      const technologies = await this.prisma.technology.findMany({
        where: {
          id: {
            in: dto.technologyIds,
          },
        },
      });

      if (technologies.length !== dto.technologyIds.length) {
        throw new NotFoundException('One or more technologies not found.');
      }
    }

    const data: Prisma.ProjectUpdateInput = {};

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }

    if (dto.slug !== undefined) {
      data.slug = dto.slug.trim().toLowerCase();
    }

    if (dto.description !== undefined) {
      data.description = dto.description.trim();
    }

    if (dto.imageUrl !== undefined) {
      data.imageUrl = dto.imageUrl.trim() || null;
    }

    if (dto.githubUrl !== undefined) {
      data.githubUrl = dto.githubUrl.trim() || null;
    }

    if (dto.liveUrl !== undefined) {
      data.liveUrl = dto.liveUrl.trim() || null;
    }

    if (dto.isFeatured !== undefined) {
      data.isFeatured = dto.isFeatured;
    }

    if (dto.categoryId !== undefined) {
      data.category = {
        connect: {
          id: dto.categoryId,
        },
      };
    }

    if (dto.technologyIds !== undefined) {
      data.technologies = {
        set: dto.technologyIds.map((technologyId) => ({
          id: technologyId,
        })),
      };
    }

    try {
      return await this.prisma.project.update({
        where: {
          id,
        },
        data,
        include: {
          category: true,
          technologies: true,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A project with the same slug already exists.',
        );
      }

      throw error;
    }
  }

  async removeProject(id: string) {
    await this.findProjectById(id);

    await this.prisma.project.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Project deleted successfully.',
      data: {
        id,
      },
    };
  }

  // =========================
  // Categories
  // =========================

  async createCategory(dto: CreateCategoryDto) {
    const name = dto.name.trim();
    const slug = this.createSlug(name);

    try {
      return await this.prisma.category.create({
        data: {
          name,
          slug,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A category with the same name or slug already exists.',
        );
      }

      throw error;
    }
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        projects: {
          include: {
            technologies: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.findCategoryById(id);

    const data: Prisma.CategoryUpdateInput = {};

    if (dto.name !== undefined) {
      const name = dto.name.trim();

      data.name = name;
      data.slug = this.createSlug(name);
    }

    try {
      return await this.prisma.category.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A category with the same name or slug already exists.',
        );
      }

      throw error;
    }
  }

  async removeCategory(id: string) {
    await this.findCategoryById(id);

    const projectsCount = await this.prisma.project.count({
      where: {
        categoryId: id,
      },
    });

    if (projectsCount > 0) {
      throw new ConflictException(
        'Cannot delete a category that contains projects.',
      );
    }

    await this.prisma.category.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Category deleted successfully.',
      data: {
        id,
      },
    };
  }

  // =========================
  // Technologies
  // =========================

  async createTechnology(dto: CreateTechnologyDto) {
    const name = dto.name.trim();
    const slug = this.createSlug(name);

    try {
      return await this.prisma.technology.create({
        data: {
          name,
          slug,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A technology with the same name or slug already exists.',
        );
      }

      throw error;
    }
  }

  async findAllTechnologies() {
    return this.prisma.technology.findMany({
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findTechnologyById(id: string) {
    const technology = await this.prisma.technology.findUnique({
      where: {
        id,
      },
      include: {
        projects: {
          include: {
            category: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!technology) {
      throw new NotFoundException('Technology not found.');
    }

    return technology;
  }

  async updateTechnology(id: string, dto: UpdateTechnologyDto) {
    await this.findTechnologyById(id);

    const data: Prisma.TechnologyUpdateInput = {};

    if (dto.name !== undefined) {
      const name = dto.name.trim();

      data.name = name;
      data.slug = this.createSlug(name);
    }

    try {
      return await this.prisma.technology.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A technology with the same name or slug already exists.',
        );
      }

      throw error;
    }
  }

  async removeTechnology(id: string) {
    await this.findTechnologyById(id);

    await this.prisma.technology.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Technology deleted successfully.',
      data: {
        id,
      },
    };
  }

  private createSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}