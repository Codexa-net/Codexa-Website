import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ClientLoginDto {
  @ApiProperty({
    description: 'Client email address',
    example: 'client@company.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Client password',
    example: 'ClientSecretPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
