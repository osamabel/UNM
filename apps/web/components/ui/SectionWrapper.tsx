import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'alt' | 'dark';
  id?: string;
}

const TONE = {
  default: 'bg-warm-50',
  alt: 'bg-warm-100',
  dark: 'bg-secondary text-warm-50',
} as const;

export function SectionWrapper({
  children,
  className,
  tone = 'default',
  id,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn(TONE[tone], 'py-16 sm:py-20 lg:py-24', className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}
