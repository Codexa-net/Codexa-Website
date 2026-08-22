import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateSocialLinkDto {
  @ApiProperty({ description: 'Platform name', example: 'GitHub' })
  @IsString()
  platform: string;

  @ApiProperty({
    description: 'Social media URL',
    example: 'https://github.com/Codexa-net',
  })
  @IsString()
  @IsUrl({}, { message: 'Invalid URL format for social link' })
  url: string;

  @ApiPropertyOptional({
    description: 'Icon identifier or CSS class',
    example: 'github',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Whether the link is active and visible',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Sorting / display order index',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
