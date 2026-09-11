import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        name: createServiceDto.name.trim(),
        category: this.optionalText(createServiceDto.category),
        description: this.optionalText(createServiceDto.description),
        basePrice: createServiceDto.basePrice ?? 0,
        status: createServiceDto.status?.trim() || 'مكتمل',
      },
    });
  }

  findAll(query: ListServicesQueryDto) {
    const search = query.search?.trim();
    const where: Prisma.ServiceWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (query.status?.trim()) {
      where.status = query.status.trim();
    }

    return this.prisma.service.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);

    const data: Prisma.ServiceUpdateInput = {};
    if (updateServiceDto.name !== undefined) {
      data.name = updateServiceDto.name.trim();
    }
    if (updateServiceDto.category !== undefined) {
      data.category = this.optionalText(updateServiceDto.category);
    }
    if (updateServiceDto.description !== undefined) {
      data.description = this.optionalText(updateServiceDto.description);
    }
    if (updateServiceDto.basePrice !== undefined) {
      data.basePrice = updateServiceDto.basePrice;
    }
    if (updateServiceDto.status !== undefined) {
      data.status = updateServiceDto.status.trim();
    }

    return this.prisma.service.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.service.delete({ where: { id } });

    return {
      message: 'Service deleted successfully.',
      data: { id },
    };
  }

  private optionalText(value?: string) {
    const trimmed = value?.trim();
    return trimmed || null;
  }
}
