import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // Services
  // =========================

  async createService(dto: CreateServiceDto) {
    await this.findCategoryById(dto.categoryId);

    try {
      return await this.prisma.service.create({
        data: {
          title: dto.title.trim(),
          slug: this.createSlug(dto.slug),
          shortDescription: dto.shortDescription.trim(),
          description: dto.description.trim(),
          iconUrl: dto.iconUrl?.trim() || null,
          imageUrl: dto.imageUrl?.trim() || null,
          features: this.cleanFeatures(dto.features),
          price: dto.price?.trim() || null,
          isFeatured: dto.isFeatured ?? false,
          isActive: dto.isActive ?? true,
          displayOrder: dto.displayOrder ?? 0,
          category: {
            connect: {
              id: dto.categoryId,
            },
          },
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A service with the same slug already exists.',
        );
      }

      throw error;
    }
  }

  async findAllServices(query: ListServicesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const where: Prisma.ServiceWhereInput = {};

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
          shortDescription: {
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
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (typeof query.featured === 'boolean') {
      where.isFeatured = query.featured;
    }

    if (typeof query.active === 'boolean') {
      where.isActive = query.active;
    }

    const [services, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: [
          {
            isFeatured: 'desc',
          },
          {
            displayOrder: 'asc',
          },
          {
            createdAt: 'desc',
          },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.service.count({
        where,
      }),
    ]);

    return {
      data: services,
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

  async findServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    return service;
  }

  async updateService(id: string, dto: UpdateServiceDto) {
    await this.findServiceById(id);

    if (dto.categoryId !== undefined) {
      await this.findCategoryById(dto.categoryId);
    }

    const data: Prisma.ServiceUpdateInput = {};

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }

    if (dto.slug !== undefined) {
      data.slug = this.createSlug(dto.slug);
    }

    if (dto.shortDescription !== undefined) {
      data.shortDescription = dto.shortDescription.trim();
    }

    if (dto.description !== undefined) {
      data.description = dto.description.trim();
    }

    if (dto.iconUrl !== undefined) {
      data.iconUrl = dto.iconUrl?.trim() || null;
    }

    if (dto.imageUrl !== undefined) {
      data.imageUrl = dto.imageUrl?.trim() || null;
    }

    if (dto.features !== undefined) {
      data.features = this.cleanFeatures(dto.features);
    }

    if (dto.price !== undefined) {
      data.price = dto.price?.trim() || null;
    }

    if (dto.isFeatured !== undefined) {
      data.isFeatured = dto.isFeatured;
    }

    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    if (dto.categoryId !== undefined) {
      data.category = {
        connect: {
          id: dto.categoryId,
        },
      };
    }

    try {
      return await this.prisma.service.update({
        where: {
          id,
        },
        data,
        include: {
          category: true,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A service with the same slug already exists.',
        );
      }

      throw error;
    }
  }

  async removeService(id: string) {
    await this.findServiceById(id);

    await this.prisma.service.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Service deleted successfully.',
      data: {
        id,
      },
    };
  }

  // =========================
  // Service categories
  // =========================

  async createCategory(dto: CreateServiceCategoryDto) {
    const name = dto.name.trim();

    try {
      return await this.prisma.serviceCategory.create({
        data: {
          name,
          slug: this.createSlug(name),
          description: dto.description?.trim() || null,
          iconUrl: dto.iconUrl?.trim() || null,
          displayOrder: dto.displayOrder ?? 0,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A service category with the same name or slug already exists.',
        );
      }

      throw error;
    }
  }

  async findAllCategories() {
    return this.prisma.serviceCategory.findMany({
      include: {
        _count: {
          select: {
            services: true,
          },
        },
      },
      orderBy: [
        {
          displayOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.serviceCategory.findUnique({
      where: {
        id,
      },
      include: {
        services: {
          orderBy: [
            {
              displayOrder: 'asc',
            },
            {
              createdAt: 'desc',
            },
          ],
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Service category not found.');
    }

    return category;
  }

  async updateCategory(id: string, dto: UpdateServiceCategoryDto) {
    await this.findCategoryById(id);

    const data: Prisma.ServiceCategoryUpdateInput = {};

    if (dto.name !== undefined) {
      const name = dto.name.trim();

      data.name = name;
      data.slug = this.createSlug(name);
    }

    if (dto.description !== undefined) {
      data.description = dto.description?.trim() || null;
    }

    if (dto.iconUrl !== undefined) {
      data.iconUrl = dto.iconUrl?.trim() || null;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    try {
      return await this.prisma.serviceCategory.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A service category with the same name or slug already exists.',
        );
      }

      throw error;
    }
  }

  async removeCategory(id: string) {
    await this.findCategoryById(id);

    const servicesCount = await this.prisma.service.count({
      where: {
        categoryId: id,
      },
    });

    if (servicesCount > 0) {
      throw new ConflictException(
        'Cannot delete a category that contains services.',
      );
    }

    await this.prisma.serviceCategory.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Service category deleted successfully.',
      data: {
        id,
      },
    };
  }

  private cleanFeatures(features?: string[]) {
    if (!features) {
      return [];
    }

    return features.map((feature) => feature.trim()).filter(Boolean);
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
