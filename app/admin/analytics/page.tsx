import { prisma } from '@/lib/prisma';
import { requireCompanyAdmin } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function AdminAnalyticsPage() {
  const session = await requireCompanyAdmin();
  const [notifications, expenses] = await Promise.all([
    prisma.notification.count({ where: { user: { companyId: session.companyId } } }),
    prisma.expense.aggregate({ where: { match: { companyId: session.companyId } }, _sum: { amount: true } })
  ]);

  return <Card><h1 className="mb-3 text-2xl font-semibold">Analytics</h1><p>Notifications générées: {notifications}</p><p>Dépenses déclarées: {expenses._sum.amount?.toString() ?? 0} EUR</p></Card>;
}
