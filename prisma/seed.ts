import { PrismaClient, Mindset, UserRole, GroupVisibility, MatchStatus, MatchParticipantStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.expenseShare.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.matchParticipant.deleteMany();
  await prisma.match.deleteMany();
  await prisma.groupPost.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.userSport.deleteMany();
  await prisma.playerProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.company.deleteMany();

  const [football, running, padel, yoga] = await Promise.all([
    prisma.sport.create({ data: { name: 'Football', icon: '⚽' } }),
    prisma.sport.create({ data: { name: 'Running', icon: '🏃' } }),
    prisma.sport.create({ data: { name: 'Padel', icon: '🎾' } }),
    prisma.sport.create({ data: { name: 'Yoga', icon: '🧘' } })
  ]);

  const companies = await Promise.all([
    prisma.company.create({ data: { name: 'Acme Corp', slug: 'acme', domain: 'acme.com', logoUrl: 'https://placehold.co/80x80' } }),
    prisma.company.create({ data: { name: 'Globex', slug: 'globex', domain: 'globex.com', logoUrl: 'https://placehold.co/80x80' } })
  ]);

  const users = await Promise.all([
    prisma.user.create({ data: { companyId: companies[0].id, email: 'admin@acme.com', firstName: 'Lina', lastName: 'Martin', role: UserRole.company_admin, department: 'People Ops', jobTitle: 'HR Lead' } }),
    prisma.user.create({ data: { companyId: companies[0].id, email: 'julien@acme.com', firstName: 'Julien', lastName: 'Petit', role: UserRole.player, department: 'Tech', jobTitle: 'Engineer' } }),
    prisma.user.create({ data: { companyId: companies[0].id, email: 'sarah@acme.com', firstName: 'Sarah', lastName: 'Boyer', role: UserRole.group_admin, department: 'Sales', jobTitle: 'Account Exec' } }),
    prisma.user.create({ data: { companyId: companies[1].id, email: 'admin@globex.com', firstName: 'Maya', lastName: 'Noel', role: UserRole.company_admin, department: 'Ops', jobTitle: 'Ops Director' } }),
    prisma.user.create({ data: { companyId: companies[1].id, email: 'leo@globex.com', firstName: 'Leo', lastName: 'Armand', role: UserRole.player, department: 'Product', jobTitle: 'PM' } })
  ]);

  for (const user of users) {
    await prisma.playerProfile.create({
      data: {
        userId: user.id,
        city: 'Paris',
        levelGlobal: Math.floor(Math.random() * 4) + 2,
        preferredMindset: Mindset.casual,
        onboardingCompleted: true,
        matchesPlayed: Math.floor(Math.random() * 20),
        wins: Math.floor(Math.random() * 10),
        losses: Math.floor(Math.random() * 10),
        rankingPoints: 950 + Math.floor(Math.random() * 300)
      }
    });
  }

  await prisma.userSport.createMany({
    data: [
      { userId: users[0].id, sportId: running.id, level: 4, isFavorite: true },
      { userId: users[1].id, sportId: football.id, level: 3, isFavorite: true },
      { userId: users[2].id, sportId: padel.id, level: 4, isFavorite: true },
      { userId: users[3].id, sportId: yoga.id, level: 5, isFavorite: true },
      { userId: users[4].id, sportId: running.id, level: 3, isFavorite: true }
    ]
  });

  const group = await prisma.group.create({
    data: {
      companyId: companies[0].id,
      name: 'Acme Football Squad',
      slug: 'acme-football-squad',
      description: 'Weekly football game for all levels',
      sportId: football.id,
      visibility: GroupVisibility.company,
      createdById: users[2].id
    }
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: group.id, userId: users[0].id, role: 'owner' },
      { groupId: group.id, userId: users[1].id, role: 'member' },
      { groupId: group.id, userId: users[2].id, role: 'moderator' }
    ]
  });

  await prisma.groupPost.createMany({
    data: [
      { groupId: group.id, authorId: users[2].id, content: 'Match jeudi 19h au Five de Bercy ?' },
      { groupId: group.id, authorId: users[1].id, content: 'Je suis chaud, je peux inviter deux collègues.' }
    ]
  });

  const match = await prisma.match.create({
    data: {
      companyId: companies[0].id,
      groupId: group.id,
      sportId: football.id,
      createdById: users[2].id,
      title: 'Acme Thursday Football',
      description: 'Friendly 5v5 game',
      mindset: Mindset.competitive,
      levelMin: 2,
      levelMax: 5,
      locationName: 'Urban Soccer Bercy',
      locationAddress: '12 Rue de Bercy, Paris',
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 50),
      maxPlayers: 10,
      status: MatchStatus.open,
      costTotal: 80
    }
  });

  await prisma.matchParticipant.createMany({
    data: [
      { matchId: match.id, userId: users[0].id, status: MatchParticipantStatus.joined },
      { matchId: match.id, userId: users[1].id, status: MatchParticipantStatus.joined },
      { matchId: match.id, userId: users[2].id, status: MatchParticipantStatus.joined }
    ]
  });

  const expense = await prisma.expense.create({
    data: {
      matchId: match.id,
      paidById: users[0].id,
      label: 'Terrain',
      amount: 80,
      currency: 'EUR'
    }
  });

  await prisma.expenseShare.createMany({
    data: [
      { expenseId: expense.id, userId: users[0].id, amountDue: 26.67, amountPaid: 80, status: 'settled' },
      { expenseId: expense.id, userId: users[1].id, amountDue: 26.67, amountPaid: 0, status: 'pending' },
      { expenseId: expense.id, userId: users[2].id, amountDue: 26.66, amountPaid: 0, status: 'pending' }
    ]
  });

  const [streak, captain] = await Promise.all([
    prisma.badge.create({ data: { code: 'STREAK_3', name: 'On Fire', description: '3 matches in a row', icon: '🔥' } }),
    prisma.badge.create({ data: { code: 'CAPTAIN', name: 'Captain', description: 'Created 5 matches', icon: '🏅' } })
  ]);

  await prisma.userBadge.createMany({
    data: [
      { userId: users[1].id, badgeId: streak.id },
      { userId: users[2].id, badgeId: captain.id }
    ]
  });

  await prisma.notification.createMany({
    data: [
      { userId: users[1].id, type: 'match', title: 'Match joined', body: 'You joined Acme Thursday Football' },
      { userId: users[2].id, type: 'expense', title: 'Expense pending', body: '2 players still need to settle match cost.' }
    ]
  });

  await prisma.adminAuditLog.create({
    data: {
      companyId: companies[0].id,
      actorUserId: users[0].id,
      action: 'GROUP_CREATED',
      entityType: 'Group',
      entityId: group.id,
      metadata: { source: 'seed', visibility: 'company' }
    }
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
