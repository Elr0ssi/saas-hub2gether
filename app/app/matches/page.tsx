import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { createMatchAction, joinMatchAction } from '@/lib/actions/app-actions';

export default async function MatchesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const session = await requireTenantUser();
  const where = {
    companyId: session.companyId,
    sportId: typeof searchParams.sportId === 'string' ? searchParams.sportId : undefined,
    mindset: typeof searchParams.mindset === 'string' ? searchParams.mindset : undefined,
    status: typeof searchParams.status === 'string' ? searchParams.status : undefined
  };
  const matches = await prisma.match.findMany({
    where,
    include: { sport: true, participants: true },
    orderBy: { startAt: 'asc' }
  });

  const sports = await prisma.sport.findMany({ where: { isActive: true } });

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="mb-3 text-2xl font-semibold">Créer un match</h1>
        <form action={createMatchAction} className="grid gap-2 md:grid-cols-3">
          <Input name="title" placeholder="Titre" required />
          <Input name="description" placeholder="Description" required />
          <Select name="sportId" required>{sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
          <Select name="mindset"><option value="casual">Casual</option><option value="competitive">Competitive</option><option value="discovery">Discovery</option></Select>
          <Input name="levelMin" type="number" min={1} max={5} placeholder="Niveau min" />
          <Input name="levelMax" type="number" min={1} max={5} placeholder="Niveau max" />
          <Input name="locationName" placeholder="Lieu" required />
          <Input name="locationAddress" placeholder="Adresse" required />
          <Input name="startAt" type="datetime-local" required />
          <Input name="endAt" type="datetime-local" required />
          <Input name="maxPlayers" type="number" min={2} max={50} placeholder="Max joueurs" required />
          <Button type="submit">Publier</Button>
        </form>
      </Card>

      {matches.map((match) => (
        <Card key={match.id} className="flex items-center justify-between">
          <div>
            <Link className="text-lg font-semibold" href={`/app/matches/${match.id}`}>{match.title}</Link>
            <p className="text-sm text-zinc-400">{match.sport.name} • {match.mindset} • {new Date(match.startAt).toLocaleString('fr-FR')}</p>
            <p className="text-xs text-zinc-500">{match.participants.length}/{match.maxPlayers} joueurs • {match.status}</p>
          </div>
          <form action={joinMatchAction.bind(null, match.id)}>
            <Button type="submit">Rejoindre</Button>
          </form>
        </Card>
      ))}
    </div>
  );
}
