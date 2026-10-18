import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';

const CLIENT_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  contact: true,
  industry: true,
  totalRevenue: true,
  logo: true,
  description: true,
  sector: true,
  website: true,
  displayOrder: true,
  year: true,
  status: true,
  category: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const email = this.optionalText(createClientDto.email)?.toLowerCase();
    let passwordHash: string | null = null;

    if (createClientDto.password) {
      passwordHash = await bcrypt.hash(createClientDto.password, 10);
    }

    const portalToken = crypto.randomBytes(32).toString('hex');

    return this.prisma.client.create({
      data: {
        name: createClientDto.name.trim(),
        email,
        passwordHash,
        portalToken,
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
      select: CLIENT_SAFE_SELECT,
    });
  }

  findAll(query: ListClientsQueryDto) {
    const search = query.search?.trim();
    const where: Prisma.ClientWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
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
      select: {
        ...CLIENT_SAFE_SELECT,
        _count: { select: { projects: true } },
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: {
        ...CLIENT_SAFE_SELECT,
        portalToken: true,
        projects: {
          select: {
            id: true,
            name: true,
            category: true,
            status: true,
            progress: true,
            cover: true,
          },
        },
      },
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
    if (updateClientDto.email !== undefined) {
      data.email = this.optionalText(updateClientDto.email)?.toLowerCase();
    }
    if (updateClientDto.password !== undefined) {
      data.passwordHash = updateClientDto.password
        ? await bcrypt.hash(updateClientDto.password, 10)
        : null;
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

    return this.prisma.client.update({
      where: { id },
      data,
      select: CLIENT_SAFE_SELECT,
    });
  }

  async generatePortalToken(id: string) {
    const client = await this.findOne(id);
    const portalToken = crypto.randomBytes(32).toString('hex');

    const updated = await this.prisma.client.update({
      where: { id },
      data: { portalToken },
    });

    return {
      message: 'Portal token generated successfully.',
      portalToken: updated.portalToken,
      portalUrl: `https://codexa.net/portal?token=${updated.portalToken}`,
    };
  }

  async sendPortalLink(id: string) {
    const client = await this.findOne(id);

    if (!client.email) {
      throw new BadRequestException('Client does not have an email address set.');
    }

    let portalToken = client.portalToken;
    if (!portalToken) {
      portalToken = crypto.randomBytes(32).toString('hex');
      await this.prisma.client.update({
        where: { id },
        data: { portalToken },
      });
    }

    const portalUrl = `https://codexa.net/portal?token=${portalToken}`;
    return this.notificationsService.sendPortalLink(
      client.email,
      client.name,
      portalUrl,
    );
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.client.delete({ where: { id } });

    return {
      message: 'Client deleted successfully.',
      data: { id },
    };
  }

  private optionalText(value?: string | null) {
    const trimmed = value?.trim();
    return trimmed || null;
  }
}
