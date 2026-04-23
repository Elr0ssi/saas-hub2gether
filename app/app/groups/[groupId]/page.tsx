import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function GroupDetailsPage({ params }: { params: { groupId: string } }) {
  const session = await requireTenantUser();
  const group = await prisma.group.findFirst({
    where: { id: params.groupId, companyId: session.companyId },
    include: {
      members: { include: { user: true } },
      posts: { include: { author: true }, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!group) notFound();

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-semibold">{group.name}</h1>
        <p className="text-zinc-300">{group.description}</p>
      </Card>
      <Card>
        <h2 className="mb-3 text-xl">Membres</h2>
        <ul className="space-y-2">{group.members.map((m) => <li key={m.id}>{m.user.firstName} {m.user.lastName} — {m.role}</li>)}</ul>
      </Card>
      <Card>
        <h2 className="mb-3 text-xl">Fil de discussion</h2>
        <ul className="space-y-2">{group.posts.map((p) => <li key={p.id}><strong>{p.author.firstName}:</strong> {p.content}</li>)}</ul>
      </Card>
    </div>
  );
}
