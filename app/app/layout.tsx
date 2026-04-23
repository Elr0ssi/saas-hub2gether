import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
