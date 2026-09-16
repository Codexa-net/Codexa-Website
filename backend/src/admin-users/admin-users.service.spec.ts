import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUsersService } from './admin-users.service';

describe('AdminUsersService', () => {
  let service: AdminUsersService;

  const prismaMock = {
    adminUser: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const admin = {
    id: '373cc561-355f-4e73-b662-66afbe1e5873',
    name: 'Codexa Super Admin',
    email: 'admin@codexa.net',
    passwordHash: 'hashed-password',
    role: 'SUPER_ADMIN',
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date('2026-08-01T00:00:00.000Z'),
    updatedAt: new Date('2026-08-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AdminUsersService>(AdminUsersService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find an admin by normalized email', async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue(admin);

    await expect(service.findByEmail('  ADMIN@CODEXA.NET  ')).resolves.toEqual(
      admin,
    );

    expect(prismaMock.adminUser.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'admin@codexa.net',
      },
    });
  });

  it('should find an active admin by id without password hash', async () => {
    const activeAdmin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    };

    prismaMock.adminUser.findFirst.mockResolvedValue(activeAdmin);

    await expect(service.findActiveById(admin.id)).resolves.toEqual(
      activeAdmin,
    );

    expect(prismaMock.adminUser.findFirst).toHaveBeenCalledWith({
      where: {
        id: admin.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
    });
  });

  it('should update the last login date', async () => {
    const lastLoginAt = new Date('2026-08-01T01:00:00.000Z');

    jest.useFakeTimers();
    jest.setSystemTime(lastLoginAt);

    prismaMock.adminUser.update.mockResolvedValue({
      id: admin.id,
      lastLoginAt,
    });

    await expect(service.updateLastLogin(admin.id)).resolves.toEqual({
      id: admin.id,
      lastLoginAt,
    });

    expect(prismaMock.adminUser.update).toHaveBeenCalledWith({
      where: {
        id: admin.id,
      },
      data: {
        lastLoginAt,
      },
      select: {
        id: true,
        lastLoginAt: true,
      },
    });
  });
});
