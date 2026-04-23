import Link from 'next/link';
import { ReactNode } from 'react';
import { requireTenantUser } from '@/lib/auth/access';

const nav = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/profile', label: 'Profile' },
  { href: '/app/groups', label: 'Groups' },
  { href: '/app/matches', label: 'Matches' },
  { href: '/app/rankings', label: 'Rankings' },
  { href: '/app/expenses', label: 'Expenses' },
  { href: '/app/notifications', label: 'Notifications' },
  { href: '/admin', label: 'Admin' }
];

export async function AppShell({ children }: { children: ReactNode }) {
  const session = await requireTenantUser();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">Hub2gether</h2>
          <p className="text-sm text-zinc-400">{session.firstName} {session.lastName}</p>
          <nav className="mt-6 space-y-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-800">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/api/auth/logout" method="post" className="mt-6">
            <button className="text-sm text-red-300">Logout</button>
          </form>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
