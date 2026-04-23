import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function MatchDetailsPage({ params }: { params: { matchId: string } }) {
  const session = await requireTenantUser();
  const match = await prisma.match.findFirst({
    where: { id: params.matchId, companyId: session.companyId },
    include: { sport: true, participants: { include: { user: true } }, expenses: true }
  });

  if (!match) notFound();

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-semibold">{match.title}</h1>
        <p>{match.description}</p>
        <p className="text-sm text-zinc-400">{match.sport.name} • {match.locationName}</p>
      </Card>
      <Card>
        <h2 className="mb-2 text-xl">Participants</h2>
        {match.participants.map((p) => <p key={p.id}>{p.user.firstName} {p.user.lastName} - {p.status}</p>)}
      </Card>
    </div>
  );
}
