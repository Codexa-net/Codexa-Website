import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SettingsService', () => {
  let service: SettingsService;
  let prisma: any;

  const mockSettings = {
    id: 'default',
    companyName: 'Codexa',
    slogan: 'Building Digital Products',
    description: 'Software Agency',
    logoUrl: null,
    faviconUrl: null,
    aboutTitle: 'About Us',
    aboutDescription: 'Description',
    mission: 'Mission',
    vision: 'Vision',
    values: ['Quality'],
    contactEmail: 'contact@codexa.net',
    contactPhone: '+20 100 000 0000',
    contactAddress: 'Cairo',
    workingHours: '9 AM - 5 PM',
    mapLocationUrl: null,
    metaTitle: 'SEO Title',
    metaDescription: 'SEO Description',
    metaKeywords: ['Codexa'],
    ogImageUrl: null,
    twitterHandle: null,
    canonicalUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSocialLink = {
    id: 'link-1',
    platform: 'GitHub',
    url: 'https://github.com/Codexa-net',
    icon: 'github',
    isEnabled: true,
    displayOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      websiteSettings: {
        upsert: jest.fn().mockResolvedValue(mockSettings),
        update: jest.fn().mockResolvedValue(mockSettings),
      },
      socialLink: {
        findMany: jest.fn().mockResolvedValue([mockSocialLink]),
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue(mockSocialLink),
        update: jest.fn().mockResolvedValue(mockSocialLink),
        delete: jest.fn().mockResolvedValue(mockSocialLink),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Website Settings', () => {
    it('should get full website settings', async () => {
      const res = await service.getWebsiteSettings();
      expect(res).toEqual(mockSettings);
    });

    it('should get about us information', async () => {
      const res = await service.getAboutUs();
      expect(res).toHaveProperty('aboutTitle', mockSettings.aboutTitle);
      expect(res).toHaveProperty('mission', mockSettings.mission);
    });

    it('should get company information', async () => {
      const res = await service.getCompanyInfo();
      expect(res).toHaveProperty('companyName', mockSettings.companyName);
    });

    it('should get contact information', async () => {
      const res = await service.getContactInfo();
      expect(res).toHaveProperty('contactEmail', mockSettings.contactEmail);
    });

    it('should get SEO settings', async () => {
      const res = await service.getSeoSettings();
      expect(res).toHaveProperty('metaTitle', mockSettings.metaTitle);
    });
  });

  describe('Social Links CRUD', () => {
    it('should find all social links', async () => {
      const res = await service.findAllSocialLinks();
      expect(res).toEqual([mockSocialLink]);
    });

    it('should find social link by id', async () => {
      prisma.socialLink.findUnique.mockResolvedValue(mockSocialLink);
      const res = await service.findSocialLinkById('link-1');
      expect(res).toEqual(mockSocialLink);
    });

    it('should throw NotFoundException if social link does not exist', async () => {
      prisma.socialLink.findUnique.mockResolvedValue(null);
      await expect(service.findSocialLinkById('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create social link', async () => {
      const dto = { platform: 'GitHub', url: 'https://github.com/Codexa-net' };
      const res = await service.createSocialLink(dto);
      expect(res).toEqual(mockSocialLink);
    });

    it('should delete social link', async () => {
      prisma.socialLink.findUnique.mockResolvedValue(mockSocialLink);
      const res = await service.deleteSocialLink('link-1');
      expect(res).toEqual({ message: 'Social link deleted successfully' });
    });
  });
});
