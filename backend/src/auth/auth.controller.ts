import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedAdmin } from './interfaces/authenticated-admin.interface';

type AuthenticatedRequest = Request & {
  user: AuthenticatedAdmin;
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in as an admin',
  })
  @ApiOkResponse({
    description: 'Authentication completed successfully.',
  })
  @ApiBadRequestResponse({
    description: 'The submitted login data is invalid.',
  })
  @ApiUnauthorizedResponse({
    description: 'The email or password is invalid.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the authenticated admin profile',
  })
  @ApiOkResponse({
    description: 'Authenticated admin returned successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'A valid access token is required.',
  })
  getCurrentAdmin(@Req() request: AuthenticatedRequest) {
    return {
      data: request.user,
    };
  }
}
