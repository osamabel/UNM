import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  interactive?: boolean;
}

// Institutional card: bordered, near-flat. The hover effect is a subtle
// border-colour change — no translation, no shadow burst.
export function Card({ children, className, as: Comp = 'div', interactive }: CardProps) {
  return (
    <Comp
      className={cn(
        'rounded-card border border-warm-200 bg-white transition-colors',
        interactive && 'hover:border-primary/40',
        className,
      )}
    >
      {children}
    </Comp>
  );
}
