import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Custom Web Applications',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example: 'custom-web-applications',
    maxLength: 220,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  slug!: string;

  @ApiProperty({
    example: 'Web applications built around how your team actually works.',
    minLength: 10,
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(300)
  shortDescription!: string;

  @ApiProperty({
    example:
      'We design and build web applications end to end, from the data model through to the interface your team uses every day.',
    minLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  description!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icons/app.svg',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  iconUrl?: string;

  @ApiPropertyOptional({
    description:
      'Upload the file through POST /uploads/image first, then send the url it returns.',
    example: 'http://localhost:3001/uploads/9f1c2d3e4a5b4c6d8e9f0a1b2c3d4e5f.webp',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    example: ['Responsive design', 'API integration', 'Ongoing support'],
    type: [String],
    maxItems: 20,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  features?: string[];

  @ApiPropertyOptional({
    example: 'Starting at 25,000 EGP',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  price?: string;

  @ApiPropertyOptional({
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Inactive services are hidden from the public listing.',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 0,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  categoryId!: string;
}
