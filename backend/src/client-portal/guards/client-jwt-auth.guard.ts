import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtClientPayload } from '../interfaces/jwt-client-payload.interface';

export type AuthenticatedClientRequest = Request & {
  client?: any;
};

@Injectable()
export class ClientJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedClientRequest>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Client authentication is required.');
    }

    let payload: JwtClientPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtClientPayload>(token);
    } catch {
      throw new UnauthorizedException('The client token is invalid or expired.');
    }

    if (!payload.sub || payload.type !== 'client') {
      throw new UnauthorizedException('Invalid client token.');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: payload.sub },
    });

    if (!client) {
      throw new UnauthorizedException('Client account not found.');
    }

    request.client = client;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      return token;
    }

    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    const accessToken = cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('clientAccessToken='))
      ?.slice('clientAccessToken='.length);

    return accessToken ? decodeURIComponent(accessToken) : undefined;
  }
}
