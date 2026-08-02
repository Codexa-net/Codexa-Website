import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    login: jest.fn(),
  };

  const jwtAuthGuardMock = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jwtAuthGuardMock.canActivate.mockReturnValue(true);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtAuthGuardMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign in an admin', async () => {
    const loginDto: LoginDto = {
      email: 'admin@codexa.net',
      password: 'CorrectPassword123!',
    };

    const result = {
      accessToken: 'signed-jwt-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      admin: {
        id: '373cc561-355f-4e73-b662-66afbe1e5873',
        name: 'Codexa Super Admin',
        email: 'admin@codexa.net',
        role: 'SUPER_ADMIN',
      },
    };

    authServiceMock.login.mockResolvedValue(result);

    await expect(controller.login(loginDto)).resolves.toEqual(result);

    expect(authServiceMock.login).toHaveBeenCalledWith(loginDto);
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
  });

  it('should return the authenticated admin', () => {
    const admin = {
      id: '373cc561-355f-4e73-b662-66afbe1e5873',
      name: 'Codexa Super Admin',
      email: 'admin@codexa.net',
      role: 'SUPER_ADMIN',
      isActive: true,
    };

    const request = {
      user: admin,
    } as Parameters<AuthController['getCurrentAdmin']>[0];

    expect(controller.getCurrentAdmin(request)).toEqual({
      data: admin,
    });
  });
});
