import type { AdminRole } from '../../generated/prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: AdminRole;
}
