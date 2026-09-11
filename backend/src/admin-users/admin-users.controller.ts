  import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import type { Request } from 'express';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import type { AuthenticatedAdmin } from '../auth/interfaces/authenticated-admin.interface';
  import { CreateAdminUserDto } from './dto/create-admin-user.dto';
  import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
  import { UpdateProfileDto } from './dto/update-profile.dto';
  import { AdminUsersService } from './admin-users.service';

  type AuthenticatedRequest = Request & { user: AuthenticatedAdmin };

  @Controller('admin-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class AdminUsersController {
    constructor(private readonly adminUsersService: AdminUsersService) {}

    @Get()
    @Roles('SUPER_ADMIN')
    findAll() {
      return this.adminUsersService.findAll();
    }

    @Post()
    @Roles('SUPER_ADMIN')
    create(@Body() dto: CreateAdminUserDto) {
      return this.adminUsersService.create(dto);
    }

    @Put('me/profile')
    updateOwnProfile(
      @Req() request: AuthenticatedRequest,
      @Body() dto: UpdateProfileDto,
    ) {
      return this.adminUsersService.updateProfile(request.user.id, dto);
    }

    @Put(':id')
    @Roles('SUPER_ADMIN')
    update(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() dto: UpdateAdminUserDto,
    ) {
      return this.adminUsersService.updateUser(id, dto);
    }

    @Delete(':id')
    @Roles('SUPER_ADMIN')
    remove(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Req() request: AuthenticatedRequest,
    ) {
      return this.adminUsersService.deleteUser(id, request.user.id);
    }
  }