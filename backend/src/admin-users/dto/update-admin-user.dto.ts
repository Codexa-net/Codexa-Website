import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ADMIN_ROLE_VALUES } from './create-admin-user.dto';

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password?: string;

  // 🟢 استخدام string هنا يمنع خطأ TS1272 نهائياً
  @IsOptional()
  @IsIn(ADMIN_ROLE_VALUES, { message: 'الدور الوظيفي يجب أن يكون من الأدوار المعتمدة' })
  role?: string;

  @IsOptional()
  track?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // 🟢 تقنيات ومهارات العضو للتحديث من البروفايل
  @IsOptional()
  @IsArray({ message: 'التقنيات يجب أن تكون مصفوفة' })
  @IsString({ each: true, message: 'كل تقنية يجب أن تكون نصاً' })
  technologies?: string[];
}