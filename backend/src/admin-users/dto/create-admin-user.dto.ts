import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const ADMIN_ROLE_VALUES = [
  'SUPER_ADMIN',
  'BACKEND_LEAD',
  'FRONTEND_LEAD',
  'UI_UX_LEAD',
  'MOBILE_APP_LEAD',
  'DEVELOPER',
  'UI_UX_DESIGNER',
  'GRAPHIC_DESIGNER',
  'SALES',
] as const;

export const STAGE_TRACK_VALUES = [
  'UI_UX',
  'FRONTEND',
  'BACKEND',
  'MOBILE_APP',
] as const;

export type AdminRoleType = (typeof ADMIN_ROLE_VALUES)[number];
export type StageTrackType = (typeof STAGE_TRACK_VALUES)[number];

export class CreateAdminUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password!: string;

  @IsIn(ADMIN_ROLE_VALUES, {
    message: 'الدور الوظيفي يجب أن يكون أحد الأدوار المعتمدة في النظام',
  })
  role!: AdminRoleType;

  @IsOptional()
  @IsIn(STAGE_TRACK_VALUES, {
    message: 'المسار الفني يجب أن يكون أحد المسارات الأربعة المعتمدة',
  })
  track?: StageTrackType;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  instaPay?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  walletNumber?: string;

  // تقنيات ومهارات العضو
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];
}