import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminUsersService } from '../../admin-users/admin-users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedAdmin } from '../interfaces/authenticated-admin.interface';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const jwtServiceMock = {
    verifyAsync: jest.fn(),
  };

  const adminUsersServiceMock = {
    findActiveById: jest.fn(),
  };

  const activeAdmin: AuthenticatedAdmin = {
    id: '373cc561-355f-4e73-b662-66afbe1e5873',
    name: 'Codexa Super Admin',
    email: 'admin@codexa.net',
    role: 'SUPER_ADMIN',
    isActive: true,
  };

  function createExecutionContext(authorization?: string) {
    const request: {
      headers: {
        authorization?: string;
      };
      user?: AuthenticatedAdmin;
    } = {
      headers: {},
    };

    if (authorization) {
      request.headers.authorization = authorization;
    }

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    return {
      context,
      request,
    };
  }

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: AdminUsersService,
          useValue: adminUsersServiceMock,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should reject a request without a token', async () => {
    const { context } = createExecutionContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Authentication is required.',
    );

    expect(jwtServiceMock.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject an invalid or expired token', async () => {
    const { context } = createExecutionContext('Bearer invalid-token');

    jwtServiceMock.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(adminUsersServiceMock.findActiveById).not.toHaveBeenCalled();
  });

  it('should reject a token without an admin id', async () => {
    const { context } = createExecutionContext('Bearer token-without-sub');

    jwtServiceMock.verifyAsync.mockResolvedValue({
      email: 'admin@codexa.net',
      role: 'SUPER_ADMIN',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      'The access token is invalid or expired.',
    );
  });

  it('should reject a token for an inactive or missing admin', async () => {
    const { context } = createExecutionContext('Bearer valid-token');

    jwtServiceMock.verifyAsync.mockResolvedValue({
      sub: activeAdmin.id,
      email: activeAdmin.email,
      role: activeAdmin.role,
    });

    adminUsersServiceMock.findActiveById.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      'The access token is invalid or expired.',
    );
  });

  it('should allow a valid token for an active admin', async () => {
    const { context, request } = createExecutionContext('Bearer valid-token');

    jwtServiceMock.verifyAsync.mockResolvedValue({
      sub: activeAdmin.id,
      email: activeAdmin.email,
      role: activeAdmin.role,
    });

    adminUsersServiceMock.findActiveById.mockResolvedValue(activeAdmin);

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('valid-token');

    expect(adminUsersServiceMock.findActiveById).toHaveBeenCalledWith(
      activeAdmin.id,
    );

    expect(request.user).toEqual(activeAdmin);
  });
});
