import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import type { Partner } from '@unm/types';

interface Props {
  partners: Partner[];
}

export function PartnerLogos({ partners }: Props) {
  const t = useTranslations('home');
  return (
    <SectionWrapper tone="alt">
      <h2 className="mb-10 text-center font-heading text-sm font-semibold uppercase tracking-[0.18em] text-secondary-400">
        {t('partnersTitle')}
      </h2>
      <div className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((p) => (
          <div
            key={p.id}
            className="flex h-16 items-center justify-center grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100"
          >
            {p.logo?.url ? (
              <Image
                src={p.logo.url}
                alt={p.name}
                width={120}
                height={48}
                className="max-h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-heading font-semibold text-secondary">{p.name}</span>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
