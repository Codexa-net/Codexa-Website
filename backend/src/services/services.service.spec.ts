import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ServicesService', () => {
  let service: ServicesService;

  const mockCategory = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Web Development',
    slug: 'web-development',
    services: [],
  };

  const mockService = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Custom Web Applications',
    slug: 'custom-web-applications',
    categoryId: mockCategory.id,
  };

  const prisma = {
    service: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    serviceCategory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('generates the slug from the name', async () => {
      prisma.serviceCategory.create.mockResolvedValue(mockCategory);

      await service.createCategory({ name: '  Web Development  ' });

      expect(prisma.serviceCategory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Web Development',
            slug: 'web-development',
          }),
        }),
      );
    });

    it('turns a duplicate name into a conflict', async () => {
      prisma.serviceCategory.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.createCategory({ name: 'Web' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('removeCategory', () => {
    it('refuses to delete a category that still has services', async () => {
      prisma.serviceCategory.findUnique.mockResolvedValue(mockCategory);
      prisma.service.count.mockResolvedValue(3);

      await expect(service.removeCategory(mockCategory.id)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.serviceCategory.delete).not.toHaveBeenCalled();
    });

    it('deletes an empty category', async () => {
      prisma.serviceCategory.findUnique.mockResolvedValue(mockCategory);
      prisma.service.count.mockResolvedValue(0);
      prisma.serviceCategory.delete.mockResolvedValue(mockCategory);

      const result = await service.removeCategory(mockCategory.id);

      expect(prisma.serviceCategory.delete).toHaveBeenCalled();
      expect(result.data.id).toBe(mockCategory.id);
    });
  });

  describe('createService', () => {
    const dto = {
      title: 'Custom Web Applications',
      slug: 'Custom Web Applications',
      shortDescription: 'Applications built around how your team works.',
      description: 'A description long enough to pass the validator rules.',
      categoryId: mockCategory.id,
    };

    it('rejects a service pointing at a category that does not exist', async () => {
      prisma.serviceCategory.findUnique.mockResolvedValue(null);

      await expect(service.createService(dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.service.create).not.toHaveBeenCalled();
    });

    it('normalises the slug and defaults isActive to true', async () => {
      prisma.serviceCategory.findUnique.mockResolvedValue(mockCategory);
      prisma.service.create.mockResolvedValue(mockService);

      await service.createService(dto);

      expect(prisma.service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'custom-web-applications',
            isActive: true,
            isFeatured: false,
            features: [],
          }),
        }),
      );
    });

    it('drops blank entries from features', async () => {
      prisma.serviceCategory.findUnique.mockResolvedValue(mockCategory);
      prisma.service.create.mockResolvedValue(mockService);

      await service.createService({
        ...dto,
        features: ['  Responsive design  ', '   ', 'API integration'],
      });

      expect(prisma.service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            features: ['Responsive design', 'API integration'],
          }),
        }),
      );
    });

    it('turns a duplicate slug into a conflict', async () => {
      prisma.serviceCategory.findUnique.mockResolvedValue(mockCategory);
      prisma.service.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.createService(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findServiceById', () => {
    it('throws when the service is missing', async () => {
      prisma.service.findUnique.mockResolvedValue(null);

      await expect(service.findServiceById(mockService.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllServices', () => {
    it('applies the filters and returns pagination meta', async () => {
      prisma.$transaction.mockResolvedValue([[mockService], 1]);

      const result = await service.findAllServices({
        page: 1,
        limit: 10,
        featured: true,
        active: true,
        categoryId: mockCategory.id,
      });

      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const findManyArgs = prisma.service.findMany.mock.calls[0][0];
      expect(findManyArgs.where).toEqual(
        expect.objectContaining({
          isFeatured: true,
          isActive: true,
          categoryId: mockCategory.id,
        }),
      );
    });

    it('leaves the active filter off when it is not sent', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAllServices({ page: 1, limit: 10 });

      const findManyArgs = prisma.service.findMany.mock.calls[0][0];
      expect(findManyArgs.where.isActive).toBeUndefined();
    });
  });
});
