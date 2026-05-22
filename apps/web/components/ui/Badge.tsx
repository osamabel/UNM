import type { ProgramType } from '@unm/types';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'program-type' | 'soft';
  type?: ProgramType;
  className?: string;
}

const TYPE_TONE: Record<ProgramType, string> = {
  DBA: 'bg-secondary text-warm-50',
  MBA: 'bg-primary text-white',
  Bachelor: 'bg-primary-50 text-primary-700 border border-primary-100/60',
  Certificate: 'bg-warm-150 text-secondary border border-warm-200/60',
};

export function Badge({ children, variant = 'default', type, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 font-heading text-xs font-medium',
        variant === 'default' && 'bg-primary text-white',
        variant === 'soft' && 'border border-primary-100/50 bg-primary-50 text-primary-700',
        variant === 'program-type' && type && TYPE_TONE[type],
        className,
      )}
    >
      {children}
    </span>
  );
}
