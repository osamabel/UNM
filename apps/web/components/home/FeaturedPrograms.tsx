import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { localized, programPath } from '@/lib/utils';
import type { Locale, Program } from '@unm/types';

interface Props {
  programs: Program[];
}

export function FeaturedPrograms({ programs }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tProgram = useTranslations('program');

  return (
    <SectionWrapper tone="alt">
      <header className="mb-10 flex items-end justify-between gap-4">
        <h2 className="font-display text-display-md text-secondary">{t('featuredProgramsTitle')}</h2>
        <Link
          href={locale === 'en' ? '/en/programs' : '/programmes'}
          className="hidden sm:block text-sm font-medium text-primary hover:underline"
        >
          {locale === 'en' ? 'View all' : 'Voir tout'} →
        </Link>
      </header>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:px-0">
        {programs.map((p) => (
          <Link
            key={p.id}
            href={programPath(p.slug, locale)}
            className="snap-start shrink-0 w-[85%] sm:w-auto"
          >
            <Card interactive className="p-6 h-full">
              <Badge variant="program-type" type={p.type}>
                {p.type}
              </Badge>
              <h3 className="mt-4 font-display text-2xl text-secondary line-clamp-2">
                {localized(p.title, locale)}
              </h3>
              <dl className="mt-4 space-y-1 text-sm text-secondary-400">
                <div className="flex justify-between">
                  <dt>{tProgram('duration')}</dt>
                  <dd className="font-medium text-secondary">{p.duration}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{tProgram('format')}</dt>
                  <dd className="font-medium text-secondary">{p.format}</dd>
                </div>
              </dl>
            </Card>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
