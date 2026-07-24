import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Editorial index, e.g. "01" — optional creative marker */
  index?: string;
  /** Kept for compatibility; rendered as a quiet mark, not a glass box */
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
  index,
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
        'section-header',
        centered && 'section-header--center',
        inverted && 'section-header--inverted',
        action && 'section-header--with-action',
        className,
      )}
    >
      <div className="section-header-main">
        {(eyebrow || index || icon) && (
          <div className="section-header-meta">
            {index ? (
              <span className="section-header-index" aria-hidden>
                {index}
              </span>
            ) : null}
            {icon && !index ? (
              <span className="section-header-icon" aria-hidden>
                <Icon name={icon} size={14} />
              </span>
            ) : null}
            {eyebrow ? <p className="section-header-eyebrow">{eyebrow}</p> : null}
            <span className="section-header-rule" aria-hidden />
          </div>
        )}

        <h2 className="section-header-title">{title}</h2>

        <span className="section-header-accent" aria-hidden />

        {description ? (
          <p className="section-header-desc">{description}</p>
        ) : null}

        {children}
      </div>

      {action ? (
        <Link href={action.href} className="section-header-action">
          <span>{action.label}</span>
          <Icon name="arrow-right" size={15} className="btn-arrow" aria-hidden />
        </Link>
      ) : null}
    </header>
  );
}
