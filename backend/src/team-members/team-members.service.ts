import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './create-team-member.dto';
import { UpdateTeamMemberDto } from './update-team-member.dto';

@Injectable()
export class TeamMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: {
        name: dto.name.trim(),
        track: dto.track.trim(),
        technologies: dto.technologies || [],
        phone: dto.phone?.trim() || null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.teamMember.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException('Team member not found.');
    }

    return member;
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    await this.findOne(id);

    return this.prisma.teamMember.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.track !== undefined ? { track: dto.track.trim() } : {}),
        ...(dto.technologies !== undefined ? { technologies: dto.technologies } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone ? dto.phone.trim() : null } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.teamMember.delete({ where: { id } });

    return {
      message: 'Team member deleted successfully.',
      data: { id },
    };
  }
}