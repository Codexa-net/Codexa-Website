import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ClientCategory, ClientStatus } from '../../generated/prisma/client';

const toBoolean = ({ value }: { value: unknown }): unknown => {
  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return value;
};

export class ListClientsQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 12, default: 12, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 12;

  @ApiPropertyOptional({
    description: 'Matches the name and both languages of the sector.',
    example: 'fintech',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ enum: ClientCategory })
  @IsOptional()
  @IsEnum(ClientCategory)
  category?: ClientCategory;

  @ApiPropertyOptional({ enum: ClientStatus })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({
    description:
      'Defaults to published clients only. The dashboard sends false to see the rest.',
    type: Boolean,
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  published?: boolean;
}
