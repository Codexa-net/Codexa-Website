import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Smart Home Automation',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example: 'smart-home-automation',
    maxLength: 220,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  slug!: string;

  @ApiProperty({
    example: 'A smart home automation system with IoT control.',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/project.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/example/project',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  githubUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/project',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  liveUrl?: string;

  @ApiPropertyOptional({
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  categoryId!: string;

  @ApiProperty({
    example: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  technologyIds!: string[];
}