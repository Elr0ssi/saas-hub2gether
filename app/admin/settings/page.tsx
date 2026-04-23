import { requireCompanyAdmin } from '@/lib/auth/access';
import { Card } from '@/components/ui/card';

export default async function AdminSettingsPage() {
  const session = await requireCompanyAdmin();
  return <Card><h1 className="mb-3 text-2xl font-semibold">Settings SSO & Tenant</h1><p>Company ID: {session.companyId}</p><p>Configurer WorkOS: Domain mapping, OIDC/SAML connections, redirect URI.</p></Card>;
}
