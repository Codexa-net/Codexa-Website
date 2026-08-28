import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientsService', () => {
  let service: ClientsService;

  const row = {
    id: '9f1c2d3e-4a5b-4c6d-8e9f-0a1b2c3d4e5f',
    name: 'ta7wila',
    slug: 'ta7wila',
    logoUrl: null,
    coverUrl: null,
    websiteUrl: 'https://ta7wila.com',
    sectorEn: 'Fintech',
    sectorAr: 'فينتك',
    descriptionEn: 'A payments platform.',
    descriptionAr: 'منصة مدفوعات.',
    testimonialEn: null,
    testimonialAr: null,
    testimonialAuthor: null,
    testimonialRole: null,
    year: '2025',
    status: 'ACTIVE',
    category: 'TECH',
    displayOrder: 1,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const prisma = {
    client: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('response shape', () => {
    it('rebuilds the { en, ar } objects the frontend type expects', async () => {
      prisma.client.findFirst.mockResolvedValue({ ...row, projects: [] });

      const result = await service.findOne('ta7wila');

      expect(result.sector).toEqual({ en: 'Fintech', ar: 'فينتك' });
      expect(result.description).toEqual({
        en: 'A payments platform.',
        ar: 'منصة مدفوعات.',
      });
    });

    it('returns null for a localized field with neither language set', async () => {
      prisma.client.findFirst.mockResolvedValue({ ...row, projects: [] });

      const result = await service.findOne('ta7wila');

      expect(result.testimonial).toBeNull();
    });

    it('lowercases the enums so types/client.ts stays valid', async () => {
      prisma.client.findFirst.mockResolvedValue({ ...row, projects: [] });

      const result = await service.findOne('ta7wila');

      expect(result.status).toBe('active');
      expect(result.category).toBe('tech');
    });

    it('exposes displayOrder as order, matching the frontend field name', async () => {
      prisma.client.findFirst.mockResolvedValue({ ...row, projects: [] });

      const result = await service.findOne('ta7wila');

      expect(result.order).toBe(1);
    });
  });

  describe('findOne', () => {
    it('looks up by id when given a uuid', async () => {
      prisma.client.findFirst.mockResolvedValue({ ...row, projects: [] });

      await service.findOne(row.id);

      expect(prisma.client.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: row.id } }),
      );
    });

    it('looks up by slug when given anything else', async () => {
      prisma.client.findFirst.mockResolvedValue({ ...row, projects: [] });

      await service.findOne('ta7wila');

      expect(prisma.client.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: 'ta7wila' } }),
      );
    });

    it('includes the projects delivered for the client', async () => {
      prisma.client.findFirst.mockResolvedValue({ ...row, projects: [] });

      await service.findOne('ta7wila');

      const args = prisma.client.findFirst.mock.calls[0][0];
      expect(args.include.projects).toBeDefined();
    });

    it('throws when the client is missing', async () => {
      prisma.client.findFirst.mockResolvedValue(null);

      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('generates the slug from the name when none is given', async () => {
      prisma.client.create.mockResolvedValue(row);

      await service.create({ name: '  Burnout Gym  ' });

      expect(prisma.client.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Burnout Gym',
            slug: 'burnout-gym',
          }),
        }),
      );
    });

    it('flattens the localized input onto its two columns', async () => {
      prisma.client.create.mockResolvedValue(row);

      await service.create({
        name: 'ta7wila',
        sector: { en: 'Fintech', ar: 'فينتك' },
      });

      expect(prisma.client.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            sectorEn: 'Fintech',
            sectorAr: 'فينتك',
          }),
        }),
      );
    });

    it('turns a duplicate slug into a conflict', async () => {
      prisma.client.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create({ name: 'ta7wila' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('leaves untouched localized fields alone', async () => {
      prisma.client.findUnique.mockResolvedValue(row);
      prisma.client.update.mockResolvedValue(row);

      await service.update(row.id, { year: '2026' });

      const data = prisma.client.update.mock.calls[0][0].data;
      expect(data.year).toBe('2026');
      expect(data).not.toHaveProperty('sectorEn');
      expect(data).not.toHaveProperty('descriptionEn');
    });

    it('normalises a slug that was sent with spaces', async () => {
      prisma.client.findUnique.mockResolvedValue(row);
      prisma.client.update.mockResolvedValue(row);

      await service.update(row.id, { slug: 'Ta7wila Payments' });

      expect(prisma.client.update.mock.calls[0][0].data.slug).toBe(
        'ta7wila-payments',
      );
    });

    it('throws when the client is missing', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.update(row.id, { year: '2026' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('hides unpublished clients unless asked for them', async () => {
      prisma.$transaction.mockResolvedValue([[row], 1]);

      await service.findAll({ page: 1, limit: 12 });

      expect(prisma.client.findMany.mock.calls[0][0].where.isPublished).toBe(
        true,
      );
    });

    it('lets the dashboard ask for the unpublished ones', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAll({ page: 1, limit: 12, published: false });

      expect(prisma.client.findMany.mock.calls[0][0].where.isPublished).toBe(
        false,
      );
    });

    it('searches the name and both sector languages', async () => {
      prisma.$transaction.mockResolvedValue([[row], 1]);

      await service.findAll({ page: 1, limit: 12, search: 'fintech' });

      const or = prisma.client.findMany.mock.calls[0][0].where.OR;
      expect(or).toHaveLength(3);
      expect(or.map((c: Record<string, unknown>) => Object.keys(c)[0])).toEqual([
        'name',
        'sectorEn',
        'sectorAr',
      ]);
    });

    it('returns the standard pagination meta', async () => {
      prisma.$transaction.mockResolvedValue([[row], 1]);

      const result = await service.findAll({ page: 1, limit: 12 });

      expect(result.meta).toEqual({
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });
});
