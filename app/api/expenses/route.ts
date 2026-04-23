import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const expenses = await prisma.expense.findMany({ where: { match: { companyId: session.companyId } }, include: { shares: true } });
  return NextResponse.json(expenses);
}
