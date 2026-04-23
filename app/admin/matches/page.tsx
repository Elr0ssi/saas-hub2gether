import { prisma } from '@/lib/prisma';
import { requireCompanyAdmin } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function AdminMatchesPage() {
  const session = await requireCompanyAdmin();
  const matches = await prisma.match.findMany({ where: { companyId: session.companyId }, include: { participants: true } });
  return <Card><h1 className="mb-3 text-2xl font-semibold">Matches</h1>{matches.map((m) => <p key={m.id}>{m.title} — {m.participants.length}/{m.maxPlayers}</p>)}</Card>;
}
