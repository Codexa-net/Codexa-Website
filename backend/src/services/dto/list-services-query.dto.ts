import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListServicesQueryDto {
  @ApiPropertyOptional({ example: 'مواقع', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ example: 'مكتمل', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}
