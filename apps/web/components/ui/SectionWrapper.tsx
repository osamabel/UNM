import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SectionTone = 'default' | 'soft' | 'alt' | 'blush' | 'dark';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  tone?: SectionTone | 'canvas';
  id?: string;
}

const TONES: Record<SectionTone | 'canvas', string> = {
  default: 'text-ink',
  canvas: 'text-ink',
  soft: 'bg-soft/70 text-ink',
  alt: 'bg-warm-100/40 text-ink',
  blush: 'bg-blush/50 text-ink',
  dark: 'glass-dark text-warm-50 !border-0',
};

export function SectionWrapper({ children, className, tone = 'default', id }: SectionWrapperProps) {
  const resolved = tone === 'canvas' ? 'default' : tone;
  const isDark = resolved === 'dark';

  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-24 py-14 sm:py-16 lg:py-20',
        !isDark && 'border-b border-warm-150/40',
        TONES[resolved],
        className,
      )}
    >
      <div className="container-page min-w-0">{children}</div>
    </section>
  );
}
