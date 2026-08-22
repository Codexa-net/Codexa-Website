import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateAboutUsDto {
  @ApiPropertyOptional({ description: 'Title for the About Us section', example: 'About Codexa' })
  @IsOptional()
  @IsString()
  aboutTitle?: string;

  @ApiPropertyOptional({
    description: 'Detailed description about the company',
    example: 'Codexa is a premier software development agency...',
  })
  @IsOptional()
  @IsString()
  aboutDescription?: string;

  @ApiPropertyOptional({ description: 'Company mission statement', example: 'To empower businesses through technology' })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiPropertyOptional({ description: 'Company vision statement', example: 'To lead digital transformation globally' })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiPropertyOptional({
    description: 'Core company values',
    example: ['Innovation', 'Excellence', 'Integrity'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  values?: string[];
}
