import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AdminUsersService } from '../../admin-users/admin-users.service';
import { AuthenticatedAdmin } from '../interfaces/authenticated-admin.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

type AuthenticatedRequest = Request & {
  user?: AuthenticatedAdmin;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminUsersService: AdminUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication is required.');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException(
        'The access token is invalid or expired.',
      );
    }

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedException(
        'The access token is invalid or expired.',
      );
    }

    const admin = await this.adminUsersService.findActiveById(payload.sub);

    if (!admin) {
      throw new UnauthorizedException(
        'The access token is invalid or expired.',
      );
    }

    request.user = admin;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
