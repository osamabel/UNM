import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="mt-3 font-display text-display-lg text-secondary">Page introuvable</h1>
      <p className="mt-4 max-w-md text-secondary-400">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className="mt-6">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
