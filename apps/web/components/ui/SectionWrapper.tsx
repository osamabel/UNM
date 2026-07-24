import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Section surface system — tones must read as distinct bands
 * so users feel clear progression between blocks.
 */
export type SectionTone = 'default' | 'soft' | 'alt' | 'blush' | 'dark';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  tone?: SectionTone | 'canvas';
  id?: string;
}

const TONES: Record<SectionTone | 'canvas', string> = {
  default: 'section-surface section-surface--canvas text-ink',
  canvas: 'section-surface section-surface--canvas text-ink',
  soft: 'section-surface section-surface--soft text-ink',
  alt: 'section-surface section-surface--alt text-ink',
  blush: 'section-surface section-surface--blush text-ink',
  dark: 'section-surface section-surface--dark text-warm-50',
};

export function SectionWrapper({ children, className, tone = 'default', id }: SectionWrapperProps) {
  const resolved = tone === 'canvas' ? 'default' : tone;
  const isDark = resolved === 'dark';

  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-24 py-12 sm:py-14 lg:py-16',
        !isDark && 'border-b border-warm-200/40',
        TONES[resolved],
        className,
      )}
    >
      <div className="container-page min-w-0">{children}</div>
    </section>
  );
}
