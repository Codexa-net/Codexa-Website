import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ClientLoginDto } from './dto/client-login.dto';
import { PortalTokenAccessDto } from './dto/portal-token-access.dto';
import { JwtClientPayload } from './interfaces/jwt-client-payload.interface';

@Injectable()
export class ClientPortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: ClientLoginDto) {
    const email = loginDto.email.trim().toLowerCase();
    const client = await this.prisma.client.findFirst({
      where: { email },
    });

    if (!client || !client.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      client.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.generateTokenResponse(client);
  }

  async accessWithToken(accessDto: PortalTokenAccessDto) {
    const token = accessDto.token.trim();
    const client = await this.prisma.client.findFirst({
      where: { portalToken: token },
    });

    if (!client) {
      throw new UnauthorizedException('Invalid or expired portal token.');
    }

    return this.generateTokenResponse(client);
  }

  private async generateTokenResponse(client: any) {
    const payload: JwtClientPayload = {
      sub: client.id,
      email: client.email,
      type: 'client',
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const expiresIn = Number(
      this.configService.get<string>('JWT_EXPIRES_IN_SECONDS', '3600'),
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        contact: client.contact,
        industry: client.industry,
        sector: client.sector,
        website: client.website,
        logo: client.logo,
      },
    };
  }

  async getProfile(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        industry: true,
        sector: true,
        website: true,
        logo: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found.');
    }

    return client;
  }

  async getProjects(clientId: string) {
    const projects = await this.prisma.project.findMany({
      where: { clientId },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
        technologies: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => this.formatProjectWithProgress(project));
  }

  async getProjectById(clientId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        clientId,
      },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
        technologies: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found or access denied.');
    }

    return this.formatProjectWithProgress(project);
  }

  // 🟢 رابط المتابعة العام والآمن للعميل (بدون تسجيل دخول وبدون كشف بيانات الفريق)
  async getPublicProjectByToken(token: string) {
    const trimmed = token.trim();

    // 1. البحث عبر الـ portalToken الخاص بالعميل
    const client = await this.prisma.client.findFirst({
      where: { portalToken: trimmed },
      include: {
        projects: {
          where: { isPublic: false },
          include: {
            stages: {
              select: {
                id: true,
                title: true,
                track: true,
                progress: true,
                isCompleted: true,
                isLeadApproved: true,
                order: true,
              },
              orderBy: [{ track: 'asc' }, { order: 'asc' }],
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (client && client.projects.length > 0) {
      const p = client.projects[0];
      return {
        id: p.id,
        name: p.name,
        status: p.status,
        progress: p.progress,
        currentStage: p.currentStage || 'UI_UX',
        deadline: p.deadline,
        stages: p.stages,
      };
    }

    // 2. البحث المباشر بمعرف المشروع (Project ID)
    const project = await this.prisma.project.findFirst({
      where: { id: trimmed },
      select: {
        id: true,
        name: true,
        status: true,
        progress: true,
        currentStage: true,
        deadline: true,
        stages: {
          select: {
            id: true,
            title: true,
            track: true,
            progress: true,
            isCompleted: true,
            isLeadApproved: true,
          },
          orderBy: [{ track: 'asc' }, { order: 'asc' }],
        },
      },
    });

    if (!project) {
      throw new NotFoundException('رابط متابعة المشروع غير صالح أو غير موجود.');
    }

    return project;
  }

  private formatProjectWithProgress(project: any) {
    const totalStages = project.stages ? project.stages.length : 0;
    const completedStages = project.stages
      ? project.stages.filter((stage: any) => stage.isCompleted).length
      : 0;

    return {
      ...project,
      totalStages,
      completedStages,
    };
  }
}