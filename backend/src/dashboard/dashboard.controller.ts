import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

/**
 * Controller for Admin Dashboard statistics.
 */
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Returns summary statistics for the Admin Dashboard.
   * Only accessible by ADMIN and SUPER_ADMIN roles.
   */
  @Get('stats')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getStatistics() {
    return this.dashboardService.getStatistics();
  }
}
