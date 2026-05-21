import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PADDING = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

export function Card({
  children,
  className,
  as: Comp = 'div',
  interactive,
  padding = 'none',
}: CardProps) {
  return (
    <Comp
      className={cn(
        interactive ? 'card-interactive' : 'card-flat',
        PADDING[padding],
        className,
      )}
    >
      {children}
    </Comp>
  );
}
