import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth/session';
import { getRedirectUri, workos } from '@/lib/auth/workos';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.redirect(new URL('/login?error=missing_code', request.url));

  const auth = await workos.userManagement.authenticateWithCode({
    code,
    clientId: process.env.WORKOS_CLIENT_ID!,
    redirectUri: getRedirectUri()
  });

  const email = auth.user.email;
  const domain = email.split('@')[1];
  const company = await prisma.company.findFirst({ where: { domain } });

  if (!company) return NextResponse.redirect(new URL('/login?error=company_not_registered', request.url));

  const user = await prisma.user.upsert({
    where: { companyId_email: { companyId: company.id, email } },
    create: {
      companyId: company.id,
      email,
      firstName: auth.user.firstName || 'First',
      lastName: auth.user.lastName || 'Last',
      role: 'player'
    },
    update: {
      firstName: auth.user.firstName || undefined,
      lastName: auth.user.lastName || undefined,
      avatarUrl: auth.user.profilePictureUrl || undefined,
      isActive: true
    }
  });

  await createSession({
    userId: user.id,
    companyId: company.id,
    role: user.role,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  });

  const profile = await prisma.playerProfile.findUnique({ where: { userId: user.id } });
  const target = profile?.onboardingCompleted ? '/app' : '/onboarding';
  return NextResponse.redirect(new URL(target, request.url));
}
