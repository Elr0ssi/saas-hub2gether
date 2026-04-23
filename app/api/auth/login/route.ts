import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRedirectUri, workos } from '@/lib/auth/workos';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const organization = String(formData.get('organization') || '');
  const domain = String(formData.get('domain') || '');

  let organizationId: string | undefined;

  if (organization) {
    const company = await prisma.company.findUnique({ where: { slug: organization } });
    organizationId = company?.id;
  } else if (domain) {
    const company = await prisma.company.findUnique({ where: { domain } });
    organizationId = company?.id;
  }

  if (!organizationId) {
    return NextResponse.redirect(new URL('/login?error=organization_not_found', request.url));
  }

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID!,
    redirectUri: getRedirectUri(),
    provider: 'authkit',
    organizationId
  });

  return NextResponse.redirect(authorizationUrl);
}
