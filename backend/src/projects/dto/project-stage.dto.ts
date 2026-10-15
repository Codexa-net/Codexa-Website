import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProjectStageDto {
  @ApiProperty({ example: 'تصميم الواجهات UI/UX', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: 'أحمد علي', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  assignedTo?: string;

  @ApiPropertyOptional({ example: 50, default: 0, minimum: 0, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

export class UpdateProjectStageDto extends PartialType(CreateProjectStageDto) {}