import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const mockDashboardService = {
      getStatistics: jest.fn().mockResolvedValue({
        users: {
          total: 10,
          active: 8,
          inactive: 2,
          roles: { superAdmin: 1, admin: 2, editor: 7 },
        },
        projects: { total: 5, featured: 2 },
        messages: { total: 3, unread: 1 },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: Reflector, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return statistics from dashboardService', async () => {
    const stats = await controller.getStatistics();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.getStatistics).toHaveBeenCalled();
    expect(stats).toHaveProperty('users');
    expect(stats).toHaveProperty('projects');
    expect(stats).toHaveProperty('messages');
  });
});
