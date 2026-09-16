import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendPortalLinkDto {
  @ApiProperty({
    description: 'Client email address',
    example: 'client@company.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Client name',
    example: 'Acme Corp',
  })
  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @ApiProperty({
    description: 'Custom portal link URL (optional override)',
    example: 'https://codexa.net/portal?token=abc123xyz',
    required: false,
  })
  @IsString()
  @IsOptional()
  portalUrl?: string;

  @ApiProperty({
    description: 'Portal access token',
    example: 'uuid-or-token-string',
    required: false,
  })
  @IsString()
  @IsOptional()
  portalToken?: string;
}
