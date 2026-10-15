import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ListProjectsQueryDto {
  @ApiPropertyOptional({ description: 'البحث بالاسم أو الوصف أو التصنيف' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'فلترة بحالة المشروع' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'فلترة بمعرف العميل' })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional({ description: 'فلترة المشاريع المميزة' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;

  // الحقل المسؤول عن حل الخطأ والسماح بالفلترة للمعرض العام
  @ApiPropertyOptional({ description: 'فلترة المشاريع العامة المعروضة للزوار' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublic?: boolean;
}