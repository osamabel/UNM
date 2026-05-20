import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Locale, Program } from '@unm/types';
import { localized, programPath } from '@/lib/utils';

interface Props {
  programs: Program[];
}

export function RelatedPrograms({ programs }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  if (!programs?.length) return null;
  return (
    <section>
      <h2 className="font-display text-2xl text-secondary">{t('related')}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {programs.map((p) => (
          <Link key={p.id} href={programPath(p.slug, locale)}>
            <Card interactive className="p-6 h-full">
              <Badge variant="program-type" type={p.type}>{p.type}</Badge>
              <h3 className="mt-3 font-display text-lg text-secondary line-clamp-2">
                {localized(p.title, locale)}
              </h3>
              <p className="mt-2 text-sm text-secondary-400">{p.duration} · {p.format}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
