import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              if (key === 'SMTP_FROM') return 'test@codexa.net';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle log-only email sending when SMTP is not configured', async () => {
    const result = await service.sendEmail({
      to: 'client@example.com',
      subject: 'Test Subject',
      content: '<p>Test Content</p>',
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('Mail logged');
  });

  it('should generate portal link email format', async () => {
    const result = await service.sendPortalLink(
      'client@example.com',
      'Acme Corp',
      'https://codexa.net/portal?token=xyz',
    );

    expect(result.success).toBe(true);
  });

  it('should generate project progress update email format', async () => {
    const result = await service.sendProjectProgressUpdate(
      'client@example.com',
      'Acme Corp',
      'Mobile App',
      75,
      'UI Design',
    );

    expect(result.success).toBe(true);
  });
});
