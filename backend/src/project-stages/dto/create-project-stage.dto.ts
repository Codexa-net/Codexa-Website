import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { StageTrack, RevisionType } from '@prisma/client';

export class CreateProjectStageDto {
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(StageTrack)
  track!: StageTrack;

  // 🟢 نوع المهمة: مهمة أساسية، تعديل مجاني، إضافة مدفوعة
  @IsOptional()
  @IsEnum(RevisionType)
  revisionType?: RevisionType;

  @IsOptional()
  @IsUUID()
  assignedUserId?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsNumber()
  reward?: number;

  // 🟢 دعم استقبال رابط فيجما والملاحظات عند إنشاء المهمة
  @IsOptional()
  @IsString()
  figmaUrl?: string;

  @IsOptional()
  @IsString()
  feedback?: string;
}