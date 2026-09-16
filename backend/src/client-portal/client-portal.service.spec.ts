import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ClientPortalService } from './client-portal.service';

describe('ClientPortalService', () => {
  let service: ClientPortalService;
  let prisma: PrismaService;

  const mockClient = {
    id: 'client-uuid-1',
    name: 'Acme Client',
    email: 'client@acme.com',
    passwordHash: '',
    portalToken: 'valid-portal-token-123',
    contact: 'John Doe',
    industry: 'Tech',
    sector: 'IT',
    website: 'https://acme.com',
    logo: null,
    description: 'Test client',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProject = {
    id: 'project-uuid-1',
    name: 'Codexa Portal',
    progress: 50,
    clientId: 'client-uuid-1',
    stages: [
      { id: 'stage-1', title: 'Analysis', isCompleted: true },
      { id: 'stage-2', title: 'Development', isCompleted: false },
    ],
    technologies: [],
  };

  beforeAll(async () => {
    mockClient.passwordHash = await bcrypt.hash('secret123', 10);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientPortalService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
            },
            project: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('jwt-mock-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('3600'),
          },
        },
      ],
    }).compile();

    service = module.get<ClientPortalService>(ClientPortalService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate client with valid email and password', async () => {
      jest.spyOn(prisma.client, 'findFirst').mockResolvedValue(mockClient as any);

      const result = await service.login({
        email: 'client@acme.com',
        password: 'secret123',
      });

      expect(result.accessToken).toBe('jwt-mock-token');
      expect(result.client.name).toBe('Acme Client');
    });

    it('should throw UnauthorizedException for invalid email/password', async () => {
      jest.spyOn(prisma.client, 'findFirst').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'wrong@acme.com',
          password: 'secret123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('accessWithToken', () => {
    it('should authenticate client with valid portalToken', async () => {
      jest.spyOn(prisma.client, 'findFirst').mockResolvedValue(mockClient as any);

      const result = await service.accessWithToken({
        token: 'valid-portal-token-123',
      });

      expect(result.accessToken).toBe('jwt-mock-token');
      expect(result.client.id).toBe('client-uuid-1');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      jest.spyOn(prisma.client, 'findFirst').mockResolvedValue(null);

      await expect(
        service.accessWithToken({ token: 'invalid-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProjects', () => {
    it('should return client projects with computed progress', async () => {
      jest.spyOn(prisma.project, 'findMany').mockResolvedValue([mockProject] as any);

      const projects = await service.getProjects('client-uuid-1');
      expect(projects).toHaveLength(1);
      expect(projects[0].computedProgress).toBe(50); // 1 out of 2 stages completed = 50%
    });
  });

  describe('getProjectById', () => {
    it('should return specific project by id', async () => {
      jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(mockProject as any);

      const project = await service.getProjectById('client-uuid-1', 'project-uuid-1');
      expect(project.id).toBe('project-uuid-1');
    });

    it('should throw NotFoundException if project does not belong to client', async () => {
      jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(null);

      await expect(
        service.getProjectById('client-uuid-1', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
