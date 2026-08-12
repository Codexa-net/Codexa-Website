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

    if (
      createUserDto.role === Role.SUPER_ADMIN &&
      currentUser?.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can create a SUPER_ADMIN user',
      );
    }

    if (createUserDto.permissions && currentUser?.role !== Role.SUPER_ADMIN) {
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

    if (
      updateUserDto.role === Role.SUPER_ADMIN &&
      currentUser?.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can promote a user to SUPER_ADMIN',
      );
    }

    if (
      targetUser.role === Role.SUPER_ADMIN &&
      currentUser?.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can modify a SUPER_ADMIN user account',
      );
    }

    if (updateUserDto.permissions && currentUser?.role !== Role.SUPER_ADMIN) {
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
    if (
      targetUser.role === Role.SUPER_ADMIN &&
      currentUser?.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Only SUPER_ADMIN can delete a SUPER_ADMIN');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
