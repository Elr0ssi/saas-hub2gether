import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function NotificationsPage() {
  const session = await requireTenantUser();
  const notifications = await prisma.notification.findMany({ where: { userId: session.userId }, orderBy: { createdAt: 'desc' } });

  return (
    <Card>
      <h1 className="mb-4 text-2xl font-semibold">Notifications</h1>
      <ul className="space-y-2">{notifications.map((n) => <li key={n.id}><strong>{n.title}</strong><p className="text-sm text-zinc-400">{n.body}</p></li>)}</ul>
    </Card>
  );
}
