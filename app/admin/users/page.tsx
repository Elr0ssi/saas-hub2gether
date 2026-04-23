import { prisma } from '@/lib/prisma';
import { requireCompanyAdmin } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function AdminUsersPage() {
  const session = await requireCompanyAdmin();
  const users = await prisma.user.findMany({ where: { companyId: session.companyId }, orderBy: { createdAt: 'desc' } });

  return <Card><h1 className="mb-3 text-2xl font-semibold">Utilisateurs</h1>{users.map((u) => <p key={u.id}>{u.firstName} {u.lastName} — {u.role}</p>)}</Card>;
}
