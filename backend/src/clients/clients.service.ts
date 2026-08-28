import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, LocalizedTextDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';

/** The row shape this service reads back, before it is reshaped for the API. */
type ClientRow = Prisma.ClientGetPayload<{
  include: { projects: { include: { category: true; technologies: true } } };
}>;

/**
 * Plain column values, so the same builder can feed both create and update.
 * Prisma's ClientUpdateInput wraps scalars in { set }, which create rejects.
 */
type WritableClientFields = Partial<
  Pick<
    ClientRow,
    | 'logoUrl'
    | 'coverUrl'
    | 'websiteUrl'
    | 'sectorEn'
    | 'sectorAr'
    | 'descriptionEn'
    | 'descriptionAr'
    | 'testimonialEn'
    | 'testimonialAr'
    | 'testimonialAuthor'
    | 'testimonialRole'
    | 'year'
    | 'status'
    | 'category'
    | 'displayOrder'
    | 'isPublished'
  >
>;

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
    const name = dto.name.trim();

    try {
      const client = await this.prisma.client.create({
        data: {
          name,
          slug: this.createSlug(dto.slug ?? name),
          ...this.buildWritableFields(dto),
        },
      });

      return this.toResponse(client);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A client with the same slug already exists.',
        );
      }

      throw error;
    }
  }

  async findAll(query: ListClientsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const search = query.search?.trim();

    const where: Prisma.ClientWhereInput = {};

    // The public site should never see a draft, so anything that does not ask
    // explicitly gets published clients only.
    where.isPublished = query.published ?? true;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sectorEn: { contains: search, mode: 'insensitive' } },
        { sectorAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [clients, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      data: clients.map((client) => this.toResponse(client)),
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

  /**
   * Backs the client details page. Accepts either the uuid or the slug, so the
   * page can be routed as /clients/ta7wila without a lookup round trip first.
   */
  async findOne(idOrSlug: string) {
    const client = await this.prisma.client.findFirst({
      where: this.isUuid(idOrSlug) ? { id: idOrSlug } : { slug: idOrSlug },
      include: {
        projects: {
          include: {
            category: true,
            technologies: true,
          },
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    return this.toResponse(client);
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.ensureExists(id);

    const data: Prisma.ClientUpdateInput = this.buildWritableFields(dto);

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.slug !== undefined) {
      data.slug = this.createSlug(dto.slug);
    }

    try {
      const client = await this.prisma.client.update({ where: { id }, data });

      return this.toResponse(client);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'A client with the same slug already exists.',
        );
      }

      throw error;
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);

    // Projects point at a client optionally, so deleting one detaches its
    // projects rather than taking them with it.
    await this.prisma.client.delete({ where: { id } });

    return {
      message: 'Client deleted successfully.',
      data: { id },
    };
  }

  private async ensureExists(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    return client;
  }

  /**
   * Flattens the { ar, en } request shape onto the two columns each field uses.
   * Only keys present on the DTO are touched, so a PATCH stays partial.
   */
  private buildWritableFields(dto: UpdateClientDto): WritableClientFields {
    const data: WritableClientFields = {};

    if (dto.logoUrl !== undefined) {
      data.logoUrl = dto.logoUrl?.trim() || null;
    }

    if (dto.coverUrl !== undefined) {
      data.coverUrl = dto.coverUrl?.trim() || null;
    }

    if (dto.websiteUrl !== undefined) {
      data.websiteUrl = dto.websiteUrl?.trim() || null;
    }

    if (dto.sector !== undefined) {
      data.sectorEn = this.text(dto.sector?.en);
      data.sectorAr = this.text(dto.sector?.ar);
    }

    if (dto.description !== undefined) {
      data.descriptionEn = this.text(dto.description?.en);
      data.descriptionAr = this.text(dto.description?.ar);
    }

    if (dto.testimonial !== undefined) {
      data.testimonialEn = this.text(dto.testimonial?.en);
      data.testimonialAr = this.text(dto.testimonial?.ar);
    }

    if (dto.testimonialAuthor !== undefined) {
      data.testimonialAuthor = this.text(dto.testimonialAuthor);
    }

    if (dto.testimonialRole !== undefined) {
      data.testimonialRole = this.text(dto.testimonialRole);
    }

    if (dto.year !== undefined) {
      data.year = this.text(dto.year);
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (dto.category !== undefined) {
      data.category = dto.category;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    if (dto.isPublished !== undefined) {
      data.isPublished = dto.isPublished;
    }

    return data;
  }

  /**
   * Rebuilds the { ar, en } objects the frontend's LocalizedText type expects,
   * and lowercases the enums so they arrive as 'active' / 'tech' rather than
   * 'ACTIVE' / 'TECH'. That keeps types/client.ts valid without a mapper.
   */
  private toResponse(client: ClientRow | Omit<ClientRow, 'projects'>) {
    const projects = 'projects' in client ? client.projects : undefined;

    return {
      id: client.id,
      name: client.name,
      slug: client.slug,
      logo: client.logoUrl ?? '',
      coverUrl: client.coverUrl,
      website: client.websiteUrl,
      sector: this.localized(client.sectorEn, client.sectorAr),
      description: this.localized(client.descriptionEn, client.descriptionAr),
      testimonial: this.localized(client.testimonialEn, client.testimonialAr),
      testimonialAuthor: client.testimonialAuthor,
      testimonialRole: client.testimonialRole,
      year: client.year,
      status: client.status.toLowerCase(),
      category: client.category.toLowerCase(),
      order: client.displayOrder,
      isPublished: client.isPublished,
      ...(projects ? { projects } : {}),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  private localized(
    en: string | null,
    ar: string | null,
  ): LocalizedTextDto | null {
    if (en === null && ar === null) {
      return null;
    }

    return { en: en ?? '', ar: ar ?? '' };
  }

  private text(value?: string | null): string | null {
    return value?.trim() || null;
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    );
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
