import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUsersService } from '../admin-users/admin-users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.adminUsersService.findByEmail(loginDto.email);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      admin.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    await this.adminUsersService.updateLastLogin(admin.id);

    const expiresIn = Number(
      this.configService.get<string>('JWT_EXPIRES_IN_SECONDS', '3600'),
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
