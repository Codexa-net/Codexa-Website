import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'مستشفى الشفاء', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: 'client@company.com', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: 'SecretPassword123!', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  password?: string;

  @ApiPropertyOptional({ example: 'سارة أحمد', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  contact?: string;

  @ApiPropertyOptional({ example: 'الرعاية الصحية', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({ example: 4000, minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalRevenue?: number;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  logo?: string;

  @ApiPropertyOptional({
    example: 'شريكنا في حلول التحول الرقمي.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ example: 'تقنية', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sector?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  website?: string;

  @ApiPropertyOptional({ example: 1, minimum: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ example: '2026', maxLength: 4 })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  year?: string;

  @ApiPropertyOptional({ example: 'active', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional({ example: 'tech', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
