import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateContactInfoDto {
  @ApiPropertyOptional({ description: 'Public contact email address', example: 'contact@codexa.net' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid contact email format' })
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Public contact phone number', example: '+20 100 000 0000' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Physical office address', example: 'Cairo, Egypt' })
  @IsOptional()
  @IsString()
  contactAddress?: string;

  @ApiPropertyOptional({ description: 'Office working hours', example: 'Sun - Thu: 9:00 AM - 5:00 PM' })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional({ description: 'Google Maps iframe or link URL', example: 'https://maps.google.com/?q=Cairo' })
  @IsOptional()
  @IsString()
  mapLocationUrl?: string;
}
