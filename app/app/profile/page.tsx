import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function ProfilePage() {
  const session = await requireTenantUser();
  const user = await prisma.user.findFirst({ where: { id: session.userId, companyId: session.companyId }, include: { playerProfile: true } });

  return (
    <Card>
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p>{user?.firstName} {user?.lastName}</p>
      <p className="text-zinc-400">{user?.email}</p>
      <p className="mt-2">Département: {user?.department ?? 'N/A'}</p>
      <p>Job title: {user?.jobTitle ?? 'N/A'}</p>
      <p>Ville: {user?.playerProfile?.city ?? 'N/A'}</p>
    </Card>
  );
}
