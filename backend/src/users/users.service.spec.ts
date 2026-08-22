import { Test, TestingModule } from '@nestjs/testing';
import { UsersService, CurrentUserContext } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$12$hashed'),
}));

interface MockPrisma {
  user: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    count: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
}

describe('UsersService Privilege Escalation & CRUD Tests', () => {
  let service: UsersService;
  let prisma: MockPrisma;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    password: '$2b$12$hashedpassword',
    role: Role.EDITOR,
    permissions: ['users:read'],
    avatarUrl: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSuperAdminUser = {
    ...mockUser,
    id: 'superadmin-1',
    email: 'superadmin@example.com',
    role: Role.SUPER_ADMIN,
    permissions: [],
  };

  beforeEach(async () => {
    const mockPrismaService: MockPrisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const mockConfigService = {
      get: jest.fn((key: string, defaultValue?: number) => defaultValue ?? 10),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService) as unknown as MockPrisma;
  });

  describe('create', () => {
    it('should allow SUPER_ADMIN to create SUPER_ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockSuperAdminUser);

      const superAdminCtx: CurrentUserContext = {
        sub: 'superadmin-1',
        role: Role.SUPER_ADMIN,
      };

      const res = await service.create(
        {
          email: 'newsa@example.com',
          name: 'SA',
          password: 'password',
          role: Role.SUPER_ADMIN,
        },
        superAdminCtx,
      );

      expect(res).toBeDefined();
    });

    it('should throw ForbiddenException if ADMIN tries to create a SUPER_ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const adminCtx: CurrentUserContext = { sub: 'admin-1', role: Role.ADMIN };

      await expect(
        service.create(
          {
            email: 'newsa@example.com',
            name: 'SA',
            password: 'password',
            role: Role.SUPER_ADMIN,
          },
          adminCtx,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if regular user tries to set role', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const editorCtx: CurrentUserContext = {
        sub: 'editor-1',
        role: Role.EDITOR,
      };

      await expect(
        service.create(
          {
            email: 'new@example.com',
            name: 'User',
            password: 'password',
            role: Role.ADMIN,
          },
          editorCtx,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if regular user tries to set isActive', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const editorCtx: CurrentUserContext = {
        sub: 'editor-1',
        role: Role.EDITOR,
      };

      await expect(
        service.create(
          {
            email: 'new@example.com',
            name: 'User',
            password: 'password',
            isActive: false,
          },
          editorCtx,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException if non-SUPER_ADMIN tries to update a SUPER_ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue(mockSuperAdminUser);

      const adminCtx: CurrentUserContext = { sub: 'admin-1', role: Role.ADMIN };

      await expect(
        service.update('superadmin-1', { name: 'Changed' }, adminCtx),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if ADMIN tries to elevate to SUPER_ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const adminCtx: CurrentUserContext = { sub: 'admin-1', role: Role.ADMIN };

      await expect(
        service.update('user-1', { role: Role.SUPER_ADMIN }, adminCtx),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if regular user tries to update user roles', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const editorCtx: CurrentUserContext = {
        sub: 'editor-1',
        role: Role.EDITOR,
      };

      await expect(
        service.update('user-1', { role: Role.ADMIN }, editorCtx),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if regular user tries to update isActive status', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const editorCtx: CurrentUserContext = {
        sub: 'editor-1',
        role: Role.EDITOR,
      };

      await expect(
        service.update('user-1', { isActive: false }, editorCtx),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should throw ForbiddenException if ADMIN tries to delete SUPER_ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue(mockSuperAdminUser);

      const adminCtx: CurrentUserContext = { sub: 'admin-1', role: Role.ADMIN };

      await expect(service.remove('superadmin-1', adminCtx)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
