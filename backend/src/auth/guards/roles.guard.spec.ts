import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const createMockContext = (user?: {
    role?: Role;
    permissions?: string[];
  }): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles or permissions are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user context is missing when roles/permissions are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [Role.ADMIN];
      return undefined;
    });

    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('User context not found'),
    );
  });

  it('should allow SUPER_ADMIN full access regardless of required roles/permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [Role.ADMIN];
      if (key === PERMISSIONS_KEY) return ['users:create'];
      return undefined;
    });

    const context = createMockContext({
      role: Role.SUPER_ADMIN,
      permissions: [],
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has required role and permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [Role.ADMIN];
      if (key === PERMISSIONS_KEY) return ['users:read'];
      return undefined;
    });

    const context = createMockContext({
      role: Role.ADMIN,
      permissions: ['users:read', 'users:write'],
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user does not have the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [Role.ADMIN];
      return undefined;
    });

    const context = createMockContext({
      role: Role.EDITOR,
      permissions: [],
    });

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('Access denied: insufficient role privileges'),
    );
  });

  it('should throw ForbiddenException if user is missing required permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === PERMISSIONS_KEY) return ['users:delete'];
      return undefined;
    });

    const context = createMockContext({
      role: Role.ADMIN,
      permissions: ['users:read'],
    });

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('Access denied: missing required permissions'),
    );
  });
});
