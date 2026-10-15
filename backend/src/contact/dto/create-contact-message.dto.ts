import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty({
    example: 'Ahmed Mohamed',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'ahmed@example.com أو +201012345678',
    description: 'البريد الإلكتروني أو رقم الواتساب',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'وسيلة التواصل (البريد أو رقم الواتساب) مطلوبة' })
  @MaxLength(255)
  email!: string;

  @ApiPropertyOptional({
    example: '+201012345678',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Website development request',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  subject?: string;

  @ApiProperty({
    example: 'I would like to discuss building a company website.',
    minLength: 10,
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty({ message: 'الرسالة مطلوبة' })
  @MinLength(10)
  @MaxLength(5000)
  message!: string;
}