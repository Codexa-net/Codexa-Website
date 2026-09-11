import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        name: createClientDto.name.trim(),
        contact: this.optionalText(createClientDto.contact),
        industry: this.optionalText(createClientDto.industry),
        totalRevenue: createClientDto.totalRevenue ?? 0,
        logo: this.optionalText(createClientDto.logo),
        description: this.optionalText(createClientDto.description),
        sector: this.optionalText(createClientDto.sector),
        website: this.optionalText(createClientDto.website),
        displayOrder: createClientDto.displayOrder ?? 0,
        year: this.optionalText(createClientDto.year),
        status: this.optionalText(createClientDto.status),
        category: this.optionalText(createClientDto.category),
      },
    });
  }

  findAll(query: ListClientsQueryDto) {
    const search = query.search?.trim();
    const where: Prisma.ClientWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { sector: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (query.status?.trim()) {
      where.status = query.status.trim();
    }
    if (query.category?.trim()) {
      where.category = query.category.trim();
    }

    return this.prisma.client.findMany({
      where,
      include: { _count: { select: { projects: true } } },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { projects: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id);

    const data: Prisma.ClientUpdateInput = {};
    if (updateClientDto.name !== undefined) {
      data.name = updateClientDto.name.trim();
    }
    if (updateClientDto.contact !== undefined) {
      data.contact = this.optionalText(updateClientDto.contact);
    }
    if (updateClientDto.industry !== undefined) {
      data.industry = this.optionalText(updateClientDto.industry);
    }
    if (updateClientDto.totalRevenue !== undefined) {
      data.totalRevenue = updateClientDto.totalRevenue;
    }
    if (updateClientDto.logo !== undefined) {
      data.logo = this.optionalText(updateClientDto.logo);
    }
    if (updateClientDto.description !== undefined) {
      data.description = this.optionalText(updateClientDto.description);
    }
    if (updateClientDto.sector !== undefined) {
      data.sector = this.optionalText(updateClientDto.sector);
    }
    if (updateClientDto.website !== undefined) {
      data.website = this.optionalText(updateClientDto.website);
    }
    if (updateClientDto.displayOrder !== undefined) {
      data.displayOrder = updateClientDto.displayOrder;
    }
    if (updateClientDto.year !== undefined) {
      data.year = this.optionalText(updateClientDto.year);
    }
    if (updateClientDto.status !== undefined) {
      data.status = this.optionalText(updateClientDto.status);
    }
    if (updateClientDto.category !== undefined) {
      data.category = this.optionalText(updateClientDto.category);
    }

    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.client.delete({ where: { id } });

    return {
      message: 'Client deleted successfully.',
      data: { id },
    };
  }

  private optionalText(value?: string) {
    const trimmed = value?.trim();
    return trimmed || null;
  }
}
