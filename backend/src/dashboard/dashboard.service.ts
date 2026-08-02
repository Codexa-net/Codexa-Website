import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatistics() {
    const [
      totalUsers,
      activeUsers,
      totalProjects,
      featuredProjects,
      totalMessages,
      unreadMessages,
      superAdmins,
      admins,
      editors,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.project.count(),
      this.prisma.project.count({ where: { isFeatured: true } }),
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { isRead: false } }),
      this.prisma.user.count({ where: { role: 'SUPER_ADMIN' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.user.count({ where: { role: 'EDITOR' } }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        roles: {
          superAdmin: superAdmins,
          admin: admins,
          editor: editors,
        },
      },
      projects: {
        total: totalProjects,
        featured: featuredProjects,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
      },
    };
  }
}
