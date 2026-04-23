'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantUser } from '@/lib/auth/access';
import { createExpenseSchema, createGroupSchema, createMatchSchema, onboardingSchema } from '@/lib/validators';

export async function completeOnboarding(formData: FormData) {
  const session = await requireTenantUser();
  const parsed = onboardingSchema.parse(Object.fromEntries(formData));

  await prisma.playerProfile.upsert({
    where: { userId: session.userId },
    update: { ...parsed, onboardingCompleted: true },
    create: { userId: session.userId, ...parsed, onboardingCompleted: true }
  });

  revalidatePath('/app');
}

export async function createGroupAction(formData: FormData) {
  const session = await requireTenantUser();
  const parsed = createGroupSchema.parse(Object.fromEntries(formData));

  const group = await prisma.group.create({
    data: {
      ...parsed,
      companyId: session.companyId,
      createdById: session.userId
    }
  });

  await prisma.groupMember.create({ data: { groupId: group.id, userId: session.userId, role: 'owner' } });
  revalidatePath('/app/groups');
}

export async function joinGroupAction(groupId: string) {
  const session = await requireTenantUser();
  const group = await prisma.group.findFirst({ where: { id: groupId, companyId: session.companyId } });
  if (!group) return;

  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId, userId: session.userId } },
    create: { groupId, userId: session.userId },
    update: {}
  });
  revalidatePath('/app/groups');
}

export async function createMatchAction(formData: FormData) {
  const session = await requireTenantUser();
  const parsed = createMatchSchema.parse(Object.fromEntries(formData));

  await prisma.match.create({
    data: {
      ...parsed,
      startAt: new Date(parsed.startAt),
      endAt: new Date(parsed.endAt),
      companyId: session.companyId,
      createdById: session.userId
    }
  });

  revalidatePath('/app/matches');
}

export async function joinMatchAction(matchId: string) {
  const session = await requireTenantUser();
  const match = await prisma.match.findFirst({ where: { id: matchId, companyId: session.companyId } });
  if (!match) return;

  await prisma.matchParticipant.upsert({
    where: { matchId_userId: { matchId, userId: session.userId } },
    create: { matchId, userId: session.userId, status: 'joined' },
    update: { status: 'joined' }
  });
  revalidatePath('/app/matches');
}

export async function createExpenseAction(formData: FormData) {
  const session = await requireTenantUser();
  const rawParticipantIds = formData.getAll('participantIds').map(String);
  const participantIds = rawParticipantIds.flatMap((chunk) => chunk.split(',')).map((id) => id.trim()).filter(Boolean);
  const parsed = createExpenseSchema.parse({
    ...Object.fromEntries(formData),
    participantIds
  });

  const match = await prisma.match.findFirst({ where: { id: parsed.matchId, companyId: session.companyId } });
  if (!match) return;

  const expense = await prisma.expense.create({
    data: {
      matchId: parsed.matchId,
      paidById: session.userId,
      label: parsed.label,
      amount: parsed.amount,
      currency: parsed.currency
    }
  });

  const split = Number((parsed.amount / parsed.participantIds.length).toFixed(2));
  await prisma.expenseShare.createMany({
    data: parsed.participantIds.map((userId) => ({ expenseId: expense.id, userId, amountDue: split }))
  });

  revalidatePath('/app/expenses');
}
