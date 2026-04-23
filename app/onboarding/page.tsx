import { completeOnboarding } from '@/lib/actions/app-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center p-6">
      <form action={completeOnboarding} className="w-full space-y-4 rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Complétez votre profil sportif</h1>
        <Input name="city" placeholder="Ville" required />
        <Input name="bio" placeholder="Bio" />
        <Input name="levelGlobal" type="number" min={1} max={5} placeholder="Niveau global (1-5)" required />
        <Select name="preferredMindset" defaultValue="casual">
          <option value="competitive">Competitive</option>
          <option value="casual">Casual</option>
          <option value="discovery">Discovery</option>
        </Select>
        <Input name="availabilityNotes" placeholder="Disponibilités" />
        <Button type="submit">Valider</Button>
      </form>
    </main>
  );
}
