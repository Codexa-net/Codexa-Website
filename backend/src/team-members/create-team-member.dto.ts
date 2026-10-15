import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty({ example: 'أحمد محمود' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  @IsNotEmpty()
  track: string;

  @ApiProperty({ example: ['NestJS', 'PostgreSQL', 'Docker'] })
  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @ApiPropertyOptional({ example: '+201000000000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}