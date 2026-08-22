import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface CurrentUserContext {
  sub: string;
  role: Role;
  permissions?: string[];
}

/**
 * Service managing database interactions and business logic for Users.
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getBcryptRounds(): number {
    return Number(this.configService.get<number>('BCRYPT_ROUNDS', 12));
  }

  /**
   * Get paginated and filtered list of users.
   */
  async findAll(search?: string, role?: Role, page = 1, limit = 10) {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safePage = Math.max(1, page);
    const skip = (safePage - 1) * safeLimit;
    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: safeLimit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          permissions: true,
          avatarUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Find a single user by ID.
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  /**
   * Find a single user by Email (used for duplicate checks and authentication).
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Create a new user with hashed password.
   */
  async create(createUserDto: CreateUserDto, currentUser?: CurrentUserContext) {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const userRole = currentUser?.role;
    const isSuperAdmin = userRole === Role.SUPER_ADMIN;
    const isAdmin = userRole === Role.ADMIN;

    // Regular users (non-ADMIN, non-SUPER_ADMIN) cannot assign roles, permissions, or isActive status
    if (!isSuperAdmin && !isAdmin) {
      if (createUserDto.role !== undefined) {
        throw new ForbiddenException('Regular users cannot assign user roles');
      }
      if (
        createUserDto.permissions !== undefined &&
        createUserDto.permissions.length > 0
      ) {
        throw new ForbiddenException('Regular users cannot assign permissions');
      }
      if (createUserDto.isActive !== undefined) {
        throw new ForbiddenException(
          'Regular users cannot set account active status',
        );
      }
    }

    // ADMIN users cannot create a SUPER_ADMIN user
    if (isAdmin && createUserDto.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can create a SUPER_ADMIN user',
      );
    }

    // ADMIN users cannot assign permissions they do not possess
    if (isAdmin && createUserDto.permissions) {
      const userPerms = currentUser?.permissions || [];
      const hasExcessPermissions = createUserDto.permissions.some(
        (perm) => !userPerms.includes(perm),
      );
      if (hasExcessPermissions) {
        throw new ForbiddenException(
          'Cannot assign permissions higher than your own permissions',
        );
      }
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.getBcryptRounds(),
    );

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Update an existing user.
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser?: CurrentUserContext,
  ) {
    const targetUser = await this.findOne(id);

    const userRole = currentUser?.role;
    const isSuperAdmin = userRole === Role.SUPER_ADMIN;
    const isAdmin = userRole === Role.ADMIN;

    // Prevent modifying higher-privilege accounts
    if (targetUser.role === Role.SUPER_ADMIN && !isSuperAdmin) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can modify a SUPER_ADMIN user account',
      );
    }
    if (targetUser.role === Role.ADMIN && !isSuperAdmin && !isAdmin) {
      throw new ForbiddenException(
        'Cannot modify a user account with higher privileges',
      );
    }

    // Privilege escalation prevention for roles
    if (updateUserDto.role !== undefined) {
      if (!isSuperAdmin && !isAdmin) {
        throw new ForbiddenException('Regular users cannot modify user roles');
      }
      if (isAdmin && updateUserDto.role === Role.SUPER_ADMIN) {
        throw new ForbiddenException(
          'Only SUPER_ADMIN can promote a user to SUPER_ADMIN',
        );
      }
    }

    // Privilege escalation prevention for permissions
    if (updateUserDto.permissions !== undefined) {
      if (!isSuperAdmin && !isAdmin) {
        throw new ForbiddenException(
          'Regular users cannot modify user permissions',
        );
      }
      if (isAdmin) {
        const userPerms = currentUser?.permissions || [];
        const hasExcessPermissions = updateUserDto.permissions.some(
          (perm) => !userPerms.includes(perm),
        );
        if (hasExcessPermissions) {
          throw new ForbiddenException(
            'Cannot assign permissions higher than your own permissions',
          );
        }
      }
    }

    // Privilege escalation prevention for active status
    if (updateUserDto.isActive !== undefined) {
      if (!isSuperAdmin && !isAdmin) {
        throw new ForbiddenException(
          'Regular users cannot modify account active status',
        );
      }
    }

    if (updateUserDto.email) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const data: Prisma.UserUpdateInput = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(
        updateUserDto.password,
        this.getBcryptRounds(),
      );
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Delete a user by ID.
   */
  async remove(id: string, currentUser?: CurrentUserContext) {
    const targetUser = await this.findOne(id);
    const userRole = currentUser?.role;
    const isSuperAdmin = userRole === Role.SUPER_ADMIN;
    const isAdmin = userRole === Role.ADMIN;

    if (targetUser.role === Role.SUPER_ADMIN && !isSuperAdmin) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can delete a SUPER_ADMIN user',
      );
    }

    if (targetUser.role === Role.ADMIN && !isSuperAdmin && !isAdmin) {
      throw new ForbiddenException(
        'Cannot delete a user account with higher privileges',
      );
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
