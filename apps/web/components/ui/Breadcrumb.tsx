import Link from 'next/link';
import { breadcrumbSchema, type BreadcrumbItem } from '@/lib/schema';
import { JsonLd } from '@/components/shared/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** default = light bar · onDark = over photo heroes · bare = no bar chrome */
  tone?: 'default' | 'onDark' | 'bare';
  className?: string;
}

export function Breadcrumb({ items, tone = 'default', className }: BreadcrumbProps) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav
        aria-label="Breadcrumb"
        className={cn(
          'breadcrumb',
          tone === 'default' && 'breadcrumb--default',
          tone === 'onDark' && 'breadcrumb--on-dark',
          tone === 'bare' && 'breadcrumb--bare',
          className,
        )}
      >
        <div className={cn(tone === 'onDark' ? 'w-full' : 'container-page', 'breadcrumb-inner')}>
          <ol className="breadcrumb-list">
            {items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              const isFirst = idx === 0;
              return (
                <li key={`${item.url}-${idx}`} className="breadcrumb-item">
                  {isFirst ? (
                    <Icon name="home" size={13} className="breadcrumb-home" aria-hidden />
                  ) : (
                    <Icon name="chevron-right" size={12} className="breadcrumb-sep" aria-hidden />
                  )}
                  {isLast ? (
                    <span aria-current="page" className="breadcrumb-current">
                      {item.name}
                    </span>
                  ) : (
                    <Link href={item.url} className="breadcrumb-link">
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
