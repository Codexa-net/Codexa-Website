import type { AdminRole } from '@prisma/client';

export interface AuthenticatedAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone?: string | null;
  avatar?: string | null;
  isActive: boolean;
}
