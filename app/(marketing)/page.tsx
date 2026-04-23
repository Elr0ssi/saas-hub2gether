import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-green-400">Hub2gether</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight">Le SaaS sport B2B multi-tenant pour engager vos équipes.</h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-300">SSO entreprise, matchmaking, groupes, gamification et analytics RH dans une plateforme premium prête production.</p>
        <div className="mt-8 flex gap-4">
          <Link className="rounded-md bg-green-500 px-5 py-3 font-medium text-black" href="/login">Démarrer</Link>
          <Link className="rounded-md border border-zinc-700 px-5 py-3" href="/admin">Voir dashboard</Link>
        </div>
      </div>
    </main>
  );
}
