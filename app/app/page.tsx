import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';

export default async function PlayerDashboardPage() {
  const session = await requireTenantUser();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      playerProfile: true,
      userSports: { include: { sport: true } },
      badges: { include: { badge: true } },
      matchEntries: { include: { match: true }, take: 5, orderBy: { createdAt: 'desc' } }
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard joueur</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-zinc-400">Matches joués</p><p className="text-2xl font-semibold">{user?.playerProfile?.matchesPlayed ?? 0}</p></Card>
        <Card><p className="text-sm text-zinc-400">Points ranking</p><p className="text-2xl font-semibold">{user?.playerProfile?.rankingPoints ?? 1000}</p></Card>
        <Card><p className="text-sm text-zinc-400">Wins</p><p className="text-2xl font-semibold">{user?.playerProfile?.wins ?? 0}</p></Card>
        <Card><p className="text-sm text-zinc-400">Losses</p><p className="text-2xl font-semibold">{user?.playerProfile?.losses ?? 0}</p></Card>
      </div>
      <Card>
        <h2 className="mb-3 text-xl">Sports pratiqués</h2>
        <div className="flex flex-wrap gap-2">{user?.userSports.map((s) => <Badge key={s.id}>{s.sport.name} • L{s.level}</Badge>)}</div>
      </Card>
      <Card>
        <h2 className="mb-3 text-xl">Badges</h2>
        <div className="flex flex-wrap gap-2">{user?.badges.map((b) => <Badge key={b.id}>{b.badge.icon} {b.badge.name}</Badge>)}</div>
      </Card>
    </div>
  );
}
