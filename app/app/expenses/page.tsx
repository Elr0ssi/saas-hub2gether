import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';
import { createExpenseAction } from '@/lib/actions/app-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function ExpensesPage() {
  const session = await requireTenantUser();
  const matches = await prisma.match.findMany({
    where: { companyId: session.companyId },
    include: { participants: true }
  });
  const expenses = await prisma.expense.findMany({
    where: { match: { companyId: session.companyId } },
    include: { shares: { include: { user: true } }, match: true }
  });

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="mb-3 text-2xl font-semibold">Créer une dépense</h1>
        <form action={createExpenseAction} className="grid gap-2">
          <select name="matchId" className="rounded-md border border-border bg-zinc-900 px-3 py-2">
            {matches.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <Input name="label" placeholder="Label" required />
          <Input name="amount" type="number" step="0.01" placeholder="Montant" required />
          <Input name="currency" defaultValue="EUR" required />
          <Input name="participantIds" placeholder="user ids séparés par virgule" />
          <Button type="submit">Ajouter</Button>
        </form>
      </Card>
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <h3 className="font-semibold">{expense.label} — {expense.amount.toString()} {expense.currency}</h3>
          <p className="text-sm text-zinc-400">Match: {expense.match.title}</p>
          {expense.shares.map((s) => <p key={s.id}>{s.user.firstName}: dû {s.amountDue.toString()} | payé {s.amountPaid.toString()}</p>)}
        </Card>
      ))}
    </div>
  );
}
