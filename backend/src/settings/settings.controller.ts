import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateWebsiteSettingsDto } from './dto/update-website-settings.dto';
import { UpdateAboutUsDto } from './dto/update-about-us.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UpdateSeoSettingsDto } from './dto/update-seo-settings.dto';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Website Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // --- GENERAL WEBSITE SETTINGS ---

  @Get()
  @ApiOperation({ summary: 'Get full aggregated website settings' })
  @ApiResponse({
    status: 200,
    description: 'Website settings retrieved successfully',
  })
  getWebsiteSettings() {
    return this.settingsService.getWebsiteSettings();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update full aggregated website settings (Admin/SuperAdmin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Website settings updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient privileges',
  })
  updateWebsiteSettings(@Body() dto: UpdateWebsiteSettingsDto) {
    return this.settingsService.updateWebsiteSettings(dto);
  }

  // --- ABOUT US ---

  @Get('about')
  @ApiOperation({ summary: 'Get About Us information' })
  @ApiResponse({
    status: 200,
    description: 'About Us details retrieved successfully',
  })
  getAboutUs() {
    return this.settingsService.getAboutUs();
  }

  @Patch('about')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update About Us information (Admin/SuperAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'About Us details updated successfully',
  })
  updateAboutUs(@Body() dto: UpdateAboutUsDto) {
    return this.settingsService.updateAboutUs(dto);
  }

  // --- COMPANY INFORMATION ---

  @Get('company')
  @ApiOperation({ summary: 'Get Company Information' })
  @ApiResponse({
    status: 200,
    description: 'Company details retrieved successfully',
  })
  getCompanyInfo() {
    return this.settingsService.getCompanyInfo();
  }

  @Patch('company')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Company Information (Admin/SuperAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'Company details updated successfully',
  })
  updateCompanyInfo(@Body() dto: UpdateCompanyInfoDto) {
    return this.settingsService.updateCompanyInfo(dto);
  }

  // --- CONTACT INFORMATION ---

  @Get('contact')
  @ApiOperation({ summary: 'Get Contact Information' })
  @ApiResponse({
    status: 200,
    description: 'Contact details retrieved successfully',
  })
  getContactInfo() {
    return this.settingsService.getContactInfo();
  }

  @Patch('contact')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Contact Information (Admin/SuperAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'Contact details updated successfully',
  })
  updateContactInfo(@Body() dto: UpdateContactInfoDto) {
    return this.settingsService.updateContactInfo(dto);
  }

  // --- SEO SETTINGS ---

  @Get('seo')
  @ApiOperation({ summary: 'Get SEO Settings' })
  @ApiResponse({
    status: 200,
    description: 'SEO settings retrieved successfully',
  })
  getSeoSettings() {
    return this.settingsService.getSeoSettings();
  }

  @Patch('seo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update SEO Settings (Admin/SuperAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'SEO settings updated successfully',
  })
  updateSeoSettings(@Body() dto: UpdateSeoSettingsDto) {
    return this.settingsService.updateSeoSettings(dto);
  }

  // --- SOCIAL LINKS CRUD ---

  @Get('social-links')
  @ApiOperation({ summary: 'Get all social links' })
  @ApiResponse({
    status: 200,
    description: 'Social links list retrieved successfully',
  })
  findAllSocialLinks() {
    return this.settingsService.findAllSocialLinks();
  }

  @Get('social-links/:id')
  @ApiParam({ name: 'id', description: 'Social link ID' })
  @ApiOperation({ summary: 'Get a single social link by ID' })
  @ApiResponse({ status: 200, description: 'Social link details retrieved' })
  @ApiResponse({ status: 404, description: 'Social link not found' })
  findSocialLinkById(@Param('id') id: string) {
    return this.settingsService.findSocialLinkById(id);
  }

  @Post('social-links')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new social link (Admin/SuperAdmin)' })
  @ApiResponse({ status: 201, description: 'Social link created successfully' })
  createSocialLink(@Body() dto: CreateSocialLinkDto) {
    return this.settingsService.createSocialLink(dto);
  }

  @Patch('social-links/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Social link ID' })
  @ApiOperation({
    summary: 'Update an existing social link (Admin/SuperAdmin)',
  })
  @ApiResponse({ status: 200, description: 'Social link updated successfully' })
  @ApiResponse({ status: 404, description: 'Social link not found' })
  updateSocialLink(@Param('id') id: string, @Body() dto: UpdateSocialLinkDto) {
    return this.settingsService.updateSocialLink(id, dto);
  }

  @Delete('social-links/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Social link ID' })
  @ApiOperation({ summary: 'Delete a social link (Admin/SuperAdmin)' })
  @ApiResponse({ status: 200, description: 'Social link deleted successfully' })
  @ApiResponse({ status: 404, description: 'Social link not found' })
  deleteSocialLink(@Param('id') id: string) {
    return this.settingsService.deleteSocialLink(id);
  }
}
