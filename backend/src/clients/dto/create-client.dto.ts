import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ClientCategory, ClientStatus } from '../../generated/prisma/client';

/**
 * Matches the frontend's LocalizedText type, so a client object can be handed
 * straight to the page without a mapping layer.
 */
export class LocalizedTextDto {
  @ApiPropertyOptional({ example: 'Fintech' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  en?: string;

  @ApiPropertyOptional({ example: 'فينتك' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  ar?: string;
}

export class CreateClientDto {
  @ApiProperty({ example: 'ta7wila', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({
    description: 'Generated from the name when omitted.',
    example: 'ta7wila',
    maxLength: 170,
  })
  @IsOptional()
  @IsString()
  @MaxLength(170)
  slug?: string;

  @ApiPropertyOptional({
    description: 'Upload through POST /uploads/image, then send the url.',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Wide image for the top of the client details page.',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  coverUrl?: string;

  @ApiPropertyOptional({ example: 'https://ta7wila.com', maxLength: 500 })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  websiteUrl?: string;

  @ApiPropertyOptional({ type: LocalizedTextDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  sector?: LocalizedTextDto;

  @ApiPropertyOptional({ type: LocalizedTextDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  description?: LocalizedTextDto;

  @ApiPropertyOptional({
    type: LocalizedTextDto,
    description: 'The quote shown on the client details page.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  testimonial?: LocalizedTextDto;

  @ApiPropertyOptional({ example: 'Ahmed Mohamed', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  testimonialAuthor?: string;

  @ApiPropertyOptional({ example: 'Chief Technology Officer', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  testimonialRole?: string;

  @ApiPropertyOptional({ example: '2025', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  year?: string;

  @ApiPropertyOptional({ enum: ClientStatus, default: ClientStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({ enum: ClientCategory, default: ClientCategory.TECH })
  @IsOptional()
  @IsEnum(ClientCategory)
  category?: ClientCategory;

  @ApiPropertyOptional({ example: 1, default: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({
    description: 'Unpublished clients are hidden from the public listing.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
