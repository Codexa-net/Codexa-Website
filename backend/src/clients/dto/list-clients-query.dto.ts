import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListClientsQueryDto {
  @ApiPropertyOptional({ example: 'شفاء', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ example: 'active', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional({ example: 'tech', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
