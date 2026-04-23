import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
