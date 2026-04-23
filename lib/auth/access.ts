import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { requireSession } from './session';

const adminRoles: UserRole[] = ['super_admin', 'company_admin'];

export async function requireTenantUser() {
  return requireSession();
}

export async function requireCompanyAdmin() {
  const session = await requireSession();
  if (!adminRoles.includes(session.role)) {
    redirect('/app');
  }
  return session;
}

export function canManageGroup(role: UserRole) {
  return role === 'super_admin' || role === 'company_admin' || role === 'group_admin';
}
