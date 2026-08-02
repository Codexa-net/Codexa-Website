import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.adminUser.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });
  }

  findActiveById(id: string) {
    return this.prisma.adminUser.findFirst({
      where: {
        id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  updateLastLogin(id: string) {
    return this.prisma.adminUser.update({
      where: {
        id,
      },
      data: {
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        lastLoginAt: true,
      },
    });
  }
}
