import { prisma } from '@/lib/prisma';
import { requireCompanyAdmin } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function AdminGroupsPage() {
  const session = await requireCompanyAdmin();
  const groups = await prisma.group.findMany({ where: { companyId: session.companyId }, include: { _count: { select: { members: true, posts: true } } } });
  return <Card><h1 className="mb-3 text-2xl font-semibold">Groupes</h1>{groups.map((g) => <p key={g.id}>{g.name} — {g._count.members} membres • {g._count.posts} posts</p>)}</Card>;
}
