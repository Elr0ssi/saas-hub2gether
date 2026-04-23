import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
      <form className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6" action="/api/auth/login" method="post">
        <h1 className="text-2xl font-semibold">Connexion SSO entreprise</h1>
        <p className="text-sm text-zinc-400">Entrez le slug organisation ou le domaine de votre entreprise.</p>
        <div>
          <label className="mb-1 block text-sm">Slug organisation</label>
          <Input name="organization" placeholder="acme" />
        </div>
        <div>
          <label className="mb-1 block text-sm">Domaine entreprise</label>
          <Input name="domain" placeholder="acme.com" />
        </div>
        <Button type="submit" className="w-full">Continuer avec SSO (OIDC/SAML)</Button>
      </form>
    </main>
  );
}
