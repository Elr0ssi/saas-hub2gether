import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createGroupAction, joinGroupAction } from '@/lib/actions/app-actions';

export default async function GroupsPage() {
  const session = await requireTenantUser();
  const groups = await prisma.group.findMany({
    where: { companyId: session.companyId },
    include: { sport: true, _count: { select: { members: true, posts: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="mb-3 text-2xl font-semibold">Créer un groupe</h1>
        <form action={createGroupAction} className="grid gap-2 md:grid-cols-2">
          <Input name="name" placeholder="Nom" required />
          <Input name="slug" placeholder="slug" required />
          <Input name="description" placeholder="Description" required className="md:col-span-2" />
          <Input name="sportId" placeholder="sportId optionnel" />
          <Button type="submit">Créer</Button>
        </form>
      </Card>
      {groups.map((group) => (
        <Card key={group.id} className="flex items-center justify-between">
          <div>
            <Link href={`/app/groups/${group.id}`} className="text-lg font-semibold">{group.name}</Link>
            <p className="text-sm text-zinc-400">{group.description}</p>
            <p className="text-xs text-zinc-500">{group._count.members} membres • {group._count.posts} posts • {group.sport?.name ?? 'Multi-sports'}</p>
          </div>
          <form action={joinGroupAction.bind(null, group.id)}>
            <Button type="submit">Rejoindre</Button>
          </form>
        </Card>
      ))}
    </div>
  );
}
