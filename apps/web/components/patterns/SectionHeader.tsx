import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon, IconBox, type IconName } from '@/components/ui/Icon';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: IconName;
  action?: { label: string; href: string };
  className?: string;
  children?: ReactNode;
  inverted?: boolean;
  align?: 'left' | 'center';
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  icon,
  action,
  className,
  children,
  inverted,
  align = 'left',
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <header
      className={cn(
        'mb-8 sm:mb-10',
        centered ? 'mx-auto max-w-2xl text-center' : 'w-full max-w-none',
        action &&
          (centered
            ? 'flex flex-col items-center gap-5'
            : 'flex max-w-none flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8'),
        className,
      )}
    >
      <div className={cn('flex min-w-0 gap-3 sm:gap-4', centered && 'flex-col items-center')}>
        {icon && (
          <IconBox
            name={icon}
            size="md"
            className={cn(
              'inline-flex shrink-0',
              centered && 'mx-auto',
              inverted && 'border-warm-200/30 bg-white/10 text-warm-50',
            )}
          />
        )}
        <div className={cn('min-w-0 flex-1', centered && 'space-y-3')}>
          {eyebrow && (
            <p className={cn('eyebrow', inverted && 'text-primary-200')}>{eyebrow}</p>
          )}
          <h2
            className={cn(
              'font-display text-display-md',
              inverted ? 'text-warm-50' : 'text-secondary',
              eyebrow && !centered && 'mt-3',
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                'leading-relaxed',
                centered ? 'mt-0' : 'mt-3',
                inverted ? 'text-warm-200' : 'text-secondary/75',
              )}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            'link-arrow shrink-0 self-start lg:self-auto',
            centered && 'self-center',
            inverted && 'text-warm-50',
          )}
        >
          {action.label}
          <Icon name="arrow-right" size={16} className="btn-arrow" />
        </Link>
      )}
    </header>
  );
}
