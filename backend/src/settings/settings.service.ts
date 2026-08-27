import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWebsiteSettingsDto } from './dto/update-website-settings.dto';
import { UpdateAboutUsDto } from './dto/update-about-us.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UpdateSeoSettingsDto } from './dto/update-seo-settings.dto';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

const SETTINGS_SINGLETON_ID = 'default';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch full aggregated website settings, creating default record if not existing.
   */
  async getWebsiteSettings() {
    return this.prisma.websiteSettings.upsert({
      where: { id: SETTINGS_SINGLETON_ID },
      update: {},
      create: {
        id: SETTINGS_SINGLETON_ID,
        companyName: 'Codexa',
        slogan: 'Building Digital Products That Scale',
        description:
          'Codexa is a premier software development and digital engineering agency.',
        contactEmail: 'contact@codexa.net',
      },
    });
  }

  /**
   * Update full aggregated website settings.
   */
  async updateWebsiteSettings(dto: UpdateWebsiteSettingsDto) {
    await this.getWebsiteSettings(); // Ensures record exists
    return this.prisma.websiteSettings.update({
      where: { id: SETTINGS_SINGLETON_ID },
      data: dto,
    });
  }

  /**
   * Fetch About Us information.
   */
  async getAboutUs() {
    const settings = await this.getWebsiteSettings();
    return {
      aboutTitle: settings.aboutTitle,
      aboutDescription: settings.aboutDescription,
      mission: settings.mission,
      vision: settings.vision,
      values: settings.values,
    };
  }

  /**
   * Update About Us information.
   */
  async updateAboutUs(dto: UpdateAboutUsDto) {
    await this.getWebsiteSettings();
    const updated = await this.prisma.websiteSettings.update({
      where: { id: SETTINGS_SINGLETON_ID },
      data: {
        aboutTitle: dto.aboutTitle,
        aboutDescription: dto.aboutDescription,
        mission: dto.mission,
        vision: dto.vision,
        values: dto.values,
      },
    });
    return {
      aboutTitle: updated.aboutTitle,
      aboutDescription: updated.aboutDescription,
      mission: updated.mission,
      vision: updated.vision,
      values: updated.values,
    };
  }

  /**
   * Fetch Company Information.
   */
  async getCompanyInfo() {
    const settings = await this.getWebsiteSettings();
    return {
      companyName: settings.companyName,
      slogan: settings.slogan,
      description: settings.description,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
    };
  }

  /**
   * Update Company Information.
   */
  async updateCompanyInfo(dto: UpdateCompanyInfoDto) {
    await this.getWebsiteSettings();
    const updated = await this.prisma.websiteSettings.update({
      where: { id: SETTINGS_SINGLETON_ID },
      data: {
        companyName: dto.companyName,
        slogan: dto.slogan,
        description: dto.description,
        logoUrl: dto.logoUrl,
        faviconUrl: dto.faviconUrl,
      },
    });
    return {
      companyName: updated.companyName,
      slogan: updated.slogan,
      description: updated.description,
      logoUrl: updated.logoUrl,
      faviconUrl: updated.faviconUrl,
    };
  }

  /**
   * Fetch Contact Information.
   */
  async getContactInfo() {
    const settings = await this.getWebsiteSettings();
    return {
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      workingHours: settings.workingHours,
      mapLocationUrl: settings.mapLocationUrl,
    };
  }

  /**
   * Update Contact Information.
   */
  async updateContactInfo(dto: UpdateContactInfoDto) {
    await this.getWebsiteSettings();
    const updated = await this.prisma.websiteSettings.update({
      where: { id: SETTINGS_SINGLETON_ID },
      data: {
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        contactAddress: dto.contactAddress,
        workingHours: dto.workingHours,
        mapLocationUrl: dto.mapLocationUrl,
      },
    });
    return {
      contactEmail: updated.contactEmail,
      contactPhone: updated.contactPhone,
      contactAddress: updated.contactAddress,
      workingHours: updated.workingHours,
      mapLocationUrl: updated.mapLocationUrl,
    };
  }

  /**
   * Fetch SEO Settings.
   */
  async getSeoSettings() {
    const settings = await this.getWebsiteSettings();
    return {
      metaTitle: settings.metaTitle,
      metaDescription: settings.metaDescription,
      metaKeywords: settings.metaKeywords,
      ogImageUrl: settings.ogImageUrl,
      twitterHandle: settings.twitterHandle,
      canonicalUrl: settings.canonicalUrl,
    };
  }

  /**
   * Update SEO Settings.
   */
  async updateSeoSettings(dto: UpdateSeoSettingsDto) {
    await this.getWebsiteSettings();
    const updated = await this.prisma.websiteSettings.update({
      where: { id: SETTINGS_SINGLETON_ID },
      data: {
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        ogImageUrl: dto.ogImageUrl,
        twitterHandle: dto.twitterHandle,
        canonicalUrl: dto.canonicalUrl,
      },
    });
    return {
      metaTitle: updated.metaTitle,
      metaDescription: updated.metaDescription,
      metaKeywords: updated.metaKeywords,
      ogImageUrl: updated.ogImageUrl,
      twitterHandle: updated.twitterHandle,
      canonicalUrl: updated.canonicalUrl,
    };
  }

  // --- SOCIAL LINKS CRUD ---

  /**
   * Retrieve all social links sorted by displayOrder.
   */
  async findAllSocialLinks() {
    return this.prisma.socialLink.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  /**
   * Retrieve a specific social link by ID.
   */
  async findSocialLinkById(id: string) {
    const link = await this.prisma.socialLink.findUnique({
      where: { id },
    });
    if (!link) {
      throw new NotFoundException(`Social link with ID "${id}" not found`);
    }
    return link;
  }

  /**
   * Create a new social link.
   */
  async createSocialLink(dto: CreateSocialLinkDto) {
    return this.prisma.socialLink.create({
      data: dto,
    });
  }

  /**
   * Update an existing social link.
   */
  async updateSocialLink(id: string, dto: UpdateSocialLinkDto) {
    await this.findSocialLinkById(id);
    return this.prisma.socialLink.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Delete a social link by ID.
   */
  async deleteSocialLink(id: string) {
    await this.findSocialLinkById(id);
    await this.prisma.socialLink.delete({
      where: { id },
    });
    return { message: 'Social link deleted successfully' };
  }
}
