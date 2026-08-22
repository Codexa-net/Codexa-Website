import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsEmail } from 'class-validator';

export class UpdateWebsiteSettingsDto {
  // Company Information
  @ApiPropertyOptional({ description: 'Official company name', example: 'Codexa Net' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ description: 'Company slogan or tagline', example: 'Building the future of software' })
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiPropertyOptional({ description: 'Short company description', example: 'Innovative software solutions.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Company logo image URL', example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Company favicon URL', example: 'https://example.com/favicon.ico' })
  @IsOptional()
  @IsString()
  faviconUrl?: string;

  // About Us
  @ApiPropertyOptional({ description: 'Title for the About Us section', example: 'About Codexa' })
  @IsOptional()
  @IsString()
  aboutTitle?: string;

  @ApiPropertyOptional({ description: 'Detailed description about the company' })
  @IsOptional()
  @IsString()
  aboutDescription?: string;

  @ApiPropertyOptional({ description: 'Company mission statement' })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiPropertyOptional({ description: 'Company vision statement' })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiPropertyOptional({ description: 'Core company values', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  values?: string[];

  // Contact Information
  @ApiPropertyOptional({ description: 'Public contact email address' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid contact email format' })
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Public contact phone number' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Physical office address' })
  @IsOptional()
  @IsString()
  contactAddress?: string;

  @ApiPropertyOptional({ description: 'Office working hours' })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional({ description: 'Google Maps iframe or link URL' })
  @IsOptional()
  @IsString()
  mapLocationUrl?: string;

  // SEO Settings
  @ApiPropertyOptional({ description: 'Default Meta Title for SEO' })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Default Meta Description for SEO' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Keywords for SEO', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];

  @ApiPropertyOptional({ description: 'Open Graph preview image URL' })
  @IsOptional()
  @IsString()
  ogImageUrl?: string;

  @ApiPropertyOptional({ description: 'Twitter social handle' })
  @IsOptional()
  @IsString()
  twitterHandle?: string;

  @ApiPropertyOptional({ description: 'Canonical URL' })
  @IsOptional()
  @IsString()
  canonicalUrl?: string;
}
