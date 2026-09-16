import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PortalTokenAccessDto {
  @ApiProperty({
    description: 'Unique client portal access token',
    example: 'd3b07384d113edec49eaa6238ad5ff00',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
