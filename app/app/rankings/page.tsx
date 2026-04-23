import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function RankingsPage() {
  const session = await requireTenantUser();
  const profiles = await prisma.playerProfile.findMany({
    where: { user: { companyId: session.companyId } },
    include: { user: true },
    orderBy: { rankingPoints: 'desc' },
    take: 20
  });

  return (
    <Card>
      <h1 className="mb-4 text-2xl font-semibold">Classement entreprise</h1>
      <ol className="space-y-2">{profiles.map((p, i) => <li key={p.id}>#{i + 1} {p.user.firstName} {p.user.lastName} — {p.rankingPoints} pts</li>)}</ol>
    </Card>
  );
}
