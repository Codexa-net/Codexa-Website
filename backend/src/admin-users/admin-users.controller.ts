import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedAdmin } from '../auth/interfaces/authenticated-admin.interface';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminUsersService } from './admin-users.service';

type AuthenticatedRequest = Request & { user: AuthenticatedAdmin };

export class CreateWalletTransactionDto {
  @IsString()
  @IsIn(['BONUS', 'DEDUCTION', 'TASK_REWARD', 'WITHDRAWAL'])
  type: 'BONUS' | 'DEDUCTION' | 'TASK_REWARD' | 'WITHDRAWAL';

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

@Controller('admin-users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @Roles(
    'SUPER_ADMIN',
    'UI_UX_LEAD',
    'FRONTEND_LEAD',
    'BACKEND_LEAD',
    'MOBILE_APP_LEAD',
  )
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

  // السماح للسوبر أدمن بتعديل أي مستخدم، أو للمستخدم بتعديل بيانات حسابه الخاص
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateAdminUserDto,
  ) {
    const isSuperAdmin = request.user.role === 'SUPER_ADMIN';
    if (!isSuperAdmin && request.user.id !== id) {
      throw new ForbiddenException('ليس لديك صلاحية لتعديل حساب مستخدم آخر.');
    }
    return this.adminUsersService.updateUser(id, dto, isSuperAdmin);
  }

  @Patch(':id')
  patchUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateAdminUserDto,
  ) {
    const isSuperAdmin = request.user.role === 'SUPER_ADMIN';
    if (!isSuperAdmin && request.user.id !== id) {
      throw new ForbiddenException('ليس لديك صلاحية لتعديل حساب مستخدم آخر.');
    }
    return this.adminUsersService.updateUser(id, dto, isSuperAdmin);
  }

  @Get(':id/transactions')
  getTransactions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const isSuperAdmin = request.user.role === 'SUPER_ADMIN';
    if (!isSuperAdmin && request.user.id !== id) {
      throw new ForbiddenException('ليس لديك صلاحية لعرض المعاملات المالية لمستخدم آخر.');
    }
    return this.adminUsersService.getTransactions(id);
  }

  @Post(':id/transactions')
  @Roles('SUPER_ADMIN')
  addTransaction(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateWalletTransactionDto,
  ) {
    return this.adminUsersService.addTransaction(id, dto);
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