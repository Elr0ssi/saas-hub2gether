import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireCompanyAdmin } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const session = await requireCompanyAdmin();

  const [activeUsers, sportsUsed, activeGroups, matchCount, recentActivity] = await Promise.all([
    prisma.user.count({ where: { companyId: session.companyId, isActive: true } }),
    prisma.userSport.groupBy({ by: ['sportId'], where: { user: { companyId: session.companyId } }, _count: { sportId: true } }),
    prisma.group.findMany({ where: { companyId: session.companyId }, include: { _count: { select: { posts: true } } }, take: 5, orderBy: { posts: { _count: 'desc' } } }),
    prisma.match.count({ where: { companyId: session.companyId } }),
    prisma.adminAuditLog.findMany({ where: { companyId: session.companyId }, orderBy: { createdAt: 'desc' }, take: 8 })
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard entreprise</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-zinc-400">Salariés actifs</p><p className="text-2xl font-semibold">{activeUsers}</p></Card>
        <Card><p className="text-sm text-zinc-400">Sports pratiqués</p><p className="text-2xl font-semibold">{sportsUsed.length}</p></Card>
        <Card><p className="text-sm text-zinc-400">Groupes actifs</p><p className="text-2xl font-semibold">{activeGroups.length}</p></Card>
        <Card><p className="text-sm text-zinc-400">Matches créés</p><p className="text-2xl font-semibold">{matchCount}</p></Card>
      </div>
      <Card>
        <h2 className="mb-3 text-xl">Groupes les plus actifs</h2>
        {activeGroups.map((g) => <p key={g.id}>{g.name} — {g._count.posts} posts</p>)}
      </Card>
      <Card>
        <h2 className="mb-3 text-xl">Activité récente (audit)</h2>
        {recentActivity.map((a) => <p key={a.id}>{a.action} • {a.entityType} • {new Date(a.createdAt).toLocaleString('fr-FR')}</p>)}
      </Card>
      <div className="flex gap-3 text-sm text-zinc-300">
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/groups">Groups</Link>
        <Link href="/admin/matches">Matches</Link>
        <Link href="/admin/analytics">Analytics</Link>
        <Link href="/admin/settings">Settings</Link>
      </div>
    </div>
  );
}
