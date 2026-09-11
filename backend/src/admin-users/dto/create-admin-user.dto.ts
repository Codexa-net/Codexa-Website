import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const ADMIN_ROLE_VALUES = [
  'SUPER_ADMIN',
  'SALES',
] as const;

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
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @IsIn(ADMIN_ROLE_VALUES)
  role!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}