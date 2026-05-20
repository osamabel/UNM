import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';

interface Stat {
  value: string;
  labelKey: 'statsStudents' | 'statsPrograms' | 'statsYears' | 'statsPartners';
}

const STATS: Stat[] = [
  { value: '1 500+', labelKey: 'statsStudents' },
  { value: '20', labelKey: 'statsPrograms' },
  { value: '10', labelKey: 'statsYears' },
  { value: '60+', labelKey: 'statsPartners' },
];

export function StatsBar() {
  const t = useTranslations('home');
  return (
    <SectionWrapper tone="dark" className="py-12">
      <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.labelKey} className="text-center">
            <dd className="font-display text-4xl text-warm-50 sm:text-5xl">{s.value}</dd>
            <dt className="mt-1 text-sm uppercase tracking-wide text-warm-200">
              {t(s.labelKey)}
            </dt>
          </div>
        ))}
      </dl>
    </SectionWrapper>
  );
}
