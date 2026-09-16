import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientPortalService } from './client-portal.service';
import { ClientLoginDto } from './dto/client-login.dto';
import { PortalTokenAccessDto } from './dto/portal-token-access.dto';
import { ClientJwtAuthGuard } from './guards/client-jwt-auth.guard';
import type { AuthenticatedClientRequest } from './guards/client-jwt-auth.guard';

@ApiTags('Client Portal')
@Controller('client-portal')
export class ClientPortalController {
  constructor(private readonly clientPortalService: ClientPortalService) {}

  @Post('auth/login')
  @ApiOperation({ summary: 'Client Portal Login via Email and Password' })
  @ApiResponse({ status: 200, description: 'Client authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  login(@Body() dto: ClientLoginDto) {
    return this.clientPortalService.login(dto);
  }

  @Post('auth/token-access')
  @ApiOperation({ summary: 'Client Portal Access via Portal Link Token' })
  @ApiResponse({ status: 200, description: 'Access granted successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired portal token' })
  accessWithToken(@Body() dto: PortalTokenAccessDto) {
    return this.clientPortalService.accessWithToken(dto);
  }

  @Get('me')
  @UseGuards(ClientJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in client profile' })
  @ApiResponse({ status: 200, description: 'Client profile details' })
  getProfile(@Req() req: AuthenticatedClientRequest) {
    return this.clientPortalService.getProfile(req.client.id);
  }

  @Get('projects')
  @UseGuards(ClientJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get projects for current client' })
  @ApiResponse({ status: 200, description: 'List of projects with stages and progress' })
  getProjects(@Req() req: AuthenticatedClientRequest) {
    return this.clientPortalService.getProjects(req.client.id);
  }

  @Get('projects/:id')
  @UseGuards(ClientJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific project details for current client' })
  @ApiResponse({ status: 200, description: 'Project details with stage progress' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  getProjectById(
    @Req() req: AuthenticatedClientRequest,
    @Param('id') projectId: string,
  ) {
    return this.clientPortalService.getProjectById(req.client.id, projectId);
  }
}
