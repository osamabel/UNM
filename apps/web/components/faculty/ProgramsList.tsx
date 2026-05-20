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

export function ProgramsList({ programs }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  if (programs.length === 0) {
    return null;
  }
  return (
    <SectionWrapper>
      <h2 className="mb-8 font-display text-display-md text-secondary">
        {locale === 'en' ? 'Programs' : 'Programmes'}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => (
          <Link key={p.id} href={programPath(p.slug, locale)} className="block">
            <Card interactive className="p-6 h-full">
              <Badge variant="program-type" type={p.type}>{p.type}</Badge>
              <h3 className="mt-3 font-display text-xl text-secondary line-clamp-2">
                {localized(p.title, locale)}
              </h3>
              <p className="mt-3 text-sm text-secondary-400">
                {t('duration')}: <span className="font-medium text-secondary">{p.duration}</span>
              </p>
              <p className="text-sm text-secondary-400">
                {t('format')}: <span className="font-medium text-secondary">{p.format}</span>
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
