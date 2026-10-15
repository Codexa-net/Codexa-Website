import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'منصة تجارة إلكترونية', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: 'e-commerce-platform', maxLength: 220 })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  slug?: string;

  @ApiPropertyOptional({ example: 'منصة متكاملة لإدارة المنتجات', maxLength: 10000 })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @ApiPropertyOptional({ example: 'منصة لإدارة المنتجات', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'متاجر إلكترونية', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: [{ name: 'Next.js' }], type: [Object] })
  @IsOptional()
  @IsArray()
  technologies?: any[];

  // تم التعديل إلى IsString ليقبل الصور المرفوعة محلياً والروابط المباشرة
  @ApiPropertyOptional({ example: '/uploads/project-cover.jpg', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/case-study' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  caseStudyUrl?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 1, minimum: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ example: 'CODEx', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  watermark?: string;

  @ApiPropertyOptional({ example: 'from-indigo-900 to-indigo-700', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  themeClass?: string;

  @ApiPropertyOptional({ example: '#7c3aed', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  glowColor?: string;

  @ApiPropertyOptional({ example: '2026', maxLength: 4 })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  year?: string;

  @ApiPropertyOptional({ example: 'تصميم، تطوير، اختبار', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  services?: string;

  @ApiPropertyOptional({ example: 'سارة محمد', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  managerName?: string;

  @ApiPropertyOptional({ example: 'أحمد علي', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  designerName?: string;

  @ApiPropertyOptional({ example: 'قيد التنفيذ', maxLength: 50, default: 'قيد التنفيذ' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional({ example: 'متوسطة', maxLength: 50, default: 'متوسطة' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  priority?: string;

  @ApiPropertyOptional({ example: 72, minimum: 0, maximum: 100, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: '2026-08-25' })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: 'client@company.com', maxLength: 255 })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  clientEmail?: string;

  @ApiPropertyOptional({ example: 'uuid-of-client' })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}