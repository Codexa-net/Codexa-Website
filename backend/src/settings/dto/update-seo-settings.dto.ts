import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateSeoSettingsDto {
  @ApiPropertyOptional({
    description: 'Default Meta Title for SEO',
    example: 'Codexa | Software Solutions & Digital Agency',
  })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Default Meta Description for SEO',
    example: 'Codexa provides top-tier web & mobile app development...',
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Keywords for SEO',
    example: ['Software', 'Web Development', 'NestJS', 'React'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];

  @ApiPropertyOptional({
    description: 'Open Graph preview image URL',
    example: 'https://example.com/og-image.png',
  })
  @IsOptional()
  @IsString()
  ogImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Twitter social handle',
    example: '@codexa_net',
  })
  @IsOptional()
  @IsString()
  twitterHandle?: string;

  @ApiPropertyOptional({
    description: 'Canonical URL',
    example: 'https://codexa.net',
  })
  @IsOptional()
  @IsString()
  canonicalUrl?: string;
}
