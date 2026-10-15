import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectStageDto } from './create-project-stage.dto';
import { IsInt, Min, Max, IsBoolean, IsOptional } from 'class-validator';

export class UpdateProjectStageDto extends PartialType(CreateProjectStageDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}