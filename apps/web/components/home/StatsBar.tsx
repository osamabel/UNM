'use client';

import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { HeroStatsBand } from '@/components/home/HeroStats';

/** Standalone stats band (e.g. university page). Home page uses stats inside HeroSection. */
export function StatsBar() {
  return (
    <SectionWrapper id="chiffres" tone="soft" className="relative overflow-hidden">
      <ScrollReveal>
        <HeroStatsBand />
      </ScrollReveal>
    </SectionWrapper>
  );
}
