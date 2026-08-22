import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('SettingsController', () => {
  let controller: SettingsController;
  let service: SettingsService;

  const mockSettings = {
    companyName: 'Codexa',
    aboutTitle: 'About Us',
    contactEmail: 'contact@codexa.net',
    metaTitle: 'SEO Title',
  };

  const mockSocialLink = {
    id: 'link-1',
    platform: 'GitHub',
    url: 'https://github.com/Codexa-net',
  };

  beforeEach(async () => {
    const mockSettingsService = {
      getWebsiteSettings: jest.fn().mockResolvedValue(mockSettings),
      updateWebsiteSettings: jest.fn().mockResolvedValue(mockSettings),
      getAboutUs: jest.fn().mockResolvedValue({ aboutTitle: 'About Us' }),
      updateAboutUs: jest.fn().mockResolvedValue({ aboutTitle: 'About Us' }),
      getCompanyInfo: jest.fn().mockResolvedValue({ companyName: 'Codexa' }),
      updateCompanyInfo: jest.fn().mockResolvedValue({ companyName: 'Codexa' }),
      getContactInfo: jest
        .fn()
        .mockResolvedValue({ contactEmail: 'contact@codexa.net' }),
      updateContactInfo: jest
        .fn()
        .mockResolvedValue({ contactEmail: 'contact@codexa.net' }),
      getSeoSettings: jest.fn().mockResolvedValue({ metaTitle: 'SEO Title' }),
      updateSeoSettings: jest
        .fn()
        .mockResolvedValue({ metaTitle: 'SEO Title' }),
      findAllSocialLinks: jest.fn().mockResolvedValue([mockSocialLink]),
      findSocialLinkById: jest.fn().mockResolvedValue(mockSocialLink),
      createSocialLink: jest.fn().mockResolvedValue(mockSocialLink),
      updateSocialLink: jest.fn().mockResolvedValue(mockSocialLink),
      deleteSocialLink: jest.fn().mockResolvedValue({ message: 'Deleted' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: Reflector, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should get website settings', async () => {
    const res = await controller.getWebsiteSettings();
    expect(res).toEqual(mockSettings);
  });

  it('should get about us', async () => {
    const res = await controller.getAboutUs();
    expect(res).toEqual({ aboutTitle: 'About Us' });
  });

  it('should get company info', async () => {
    const res = await controller.getCompanyInfo();
    expect(res).toEqual({ companyName: 'Codexa' });
  });

  it('should get contact info', async () => {
    const res = await controller.getContactInfo();
    expect(res).toEqual({ contactEmail: 'contact@codexa.net' });
  });

  it('should get SEO settings', async () => {
    const res = await controller.getSeoSettings();
    expect(res).toEqual({ metaTitle: 'SEO Title' });
  });

  it('should find all social links', async () => {
    const res = await controller.findAllSocialLinks();
    expect(res).toEqual([mockSocialLink]);
  });
});
