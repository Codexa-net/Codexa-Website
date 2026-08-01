import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AdminUsersService } from '../admin-users/admin-users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let passwordHash: string;

  const adminUsersServiceMock = {
    findByEmail: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const loginDto: LoginDto = {
    email: 'admin@codexa.net',
    password: 'CorrectPassword123!',
  };

  beforeAll(async () => {
    passwordHash = await bcrypt.hash(loginDto.password, 4);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    configServiceMock.get.mockReturnValue('3600');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AdminUsersService,
          useValue: adminUsersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate an active admin and return a token', async () => {
    const admin = {
      id: '373cc561-355f-4e73-b662-66afbe1e5873',
      name: 'Codexa Super Admin',
      email: 'admin@codexa.net',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    };

    adminUsersServiceMock.findByEmail.mockResolvedValue(admin);
    adminUsersServiceMock.updateLastLogin.mockResolvedValue({
      id: admin.id,
      lastLoginAt: new Date(),
    });
    jwtServiceMock.signAsync.mockResolvedValue('signed-jwt-token');

    await expect(service.login(loginDto)).resolves.toEqual({
      accessToken: 'signed-jwt-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    expect(adminUsersServiceMock.findByEmail).toHaveBeenCalledWith(
      loginDto.email,
    );

    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    expect(adminUsersServiceMock.updateLastLogin).toHaveBeenCalledWith(
      admin.id,
    );
  });

  it('should reject a missing admin', async () => {
    adminUsersServiceMock.findByEmail.mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });

  it('should reject an inactive admin', async () => {
    adminUsersServiceMock.findByEmail.mockResolvedValue({
      id: '373cc561-355f-4e73-b662-66afbe1e5873',
      email: 'admin@codexa.net',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: false,
    });

    await expect(service.login(loginDto)).rejects.toThrow(
      'Invalid email or password.',
    );

    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });

  it('should reject an invalid password', async () => {
    adminUsersServiceMock.findByEmail.mockResolvedValue({
      id: '373cc561-355f-4e73-b662-66afbe1e5873',
      name: 'Codexa Super Admin',
      email: 'admin@codexa.net',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    });

    await expect(
      service.login({
        email: loginDto.email,
        password: 'WrongPassword123!',
      }),
    ).rejects.toThrow('Invalid email or password.');

    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });
});
