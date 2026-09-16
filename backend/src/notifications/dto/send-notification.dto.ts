import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'client@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  to!: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Project Status Update',
  })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({
    description: 'HTML content or message body',
    example: '<p>Your project status has been updated to 75%.</p>',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
