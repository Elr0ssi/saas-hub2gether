import { UserRole } from '@prisma/client';

export type SessionPayload = {
  userId: string;
  companyId: string;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
};
