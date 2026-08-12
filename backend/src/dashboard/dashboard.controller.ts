import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Controller for Admin Dashboard statistics.
 */
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Returns summary statistics for the Admin Dashboard.
   */
  @Get('stats')
  getStatistics() {
    return this.dashboardService.getStatistics();
  }
}
