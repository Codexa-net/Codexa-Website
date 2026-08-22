import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsBoolean, IsInt } from 'class-validator';

export class UpdateSocialLinkDto {
  @ApiPropertyOptional({ description: 'Platform name', example: 'GitHub' })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({ description: 'Social media URL', example: 'https://github.com/Codexa-net' })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Invalid URL format for social link' })
  url?: string;

  @ApiPropertyOptional({ description: 'Icon identifier or CSS class', example: 'github' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Whether the link is active and visible' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Sorting / display order index' })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
