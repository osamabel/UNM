import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { IconBox, type IconName } from '@/components/ui/Icon';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: IconName;
  className?: string;
  children?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn('mb-0 border-b border-warm-150/70 pb-8 sm:pb-10', className)}>
      <div className="flex min-w-0 gap-4 sm:gap-5">
        {icon && <IconBox name={icon} size="lg" className="inline-flex shrink-0" />}
        <div className="min-w-0 flex-1">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1
            className={cn(
              'break-words font-display text-display-lg text-secondary',
              eyebrow && 'mt-3',
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary/75 sm:text-[17px]">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
