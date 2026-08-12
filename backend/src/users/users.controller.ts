import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

interface RequestWithUser {
  user: {
    sub: string;
    role: Role;
    permissions?: string[];
  };
}

/**
 * Controller handling user management operations (Users CRUD).
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieve list of users with optional filtering, search, and pagination.
   */
  @Get()
  @Permissions('users:read')
  findAll(
    @Query('search') search?: string,
    @Query('role') role?: Role,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.usersService.findAll(search, role, page, limit);
  }

  /**
   * Retrieve details of a specific user by ID.
   */
  @Get(':id')
  @Permissions('users:read')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Create a new user account with hashed password and role assignment.
   */
  @Post()
  @Permissions('users:create')
  create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.usersService.create(createUserDto, req.user);
  }

  /**
   * Update details, roles, or permissions of an existing user.
   */
  @Patch(':id')
  @Permissions('users:update')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  /**
   * Delete a user account by ID.
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions('users:delete')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.usersService.remove(id, req.user);
  }
}
