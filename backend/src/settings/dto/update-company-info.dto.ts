import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyInfoDto {
  @ApiPropertyOptional({
    description: 'Official company name',
    example: 'Codexa Net',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'Company slogan or tagline',
    example: 'Building the future of software',
  })
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiPropertyOptional({
    description: 'Short company description',
    example: 'Innovative software solutions and digital agency.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Company logo image URL',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Company favicon URL',
    example: 'https://example.com/favicon.ico',
  })
  @IsOptional()
  @IsString()
  faviconUrl?: string;
}
