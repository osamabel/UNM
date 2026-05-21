import Link from 'next/link';
import { breadcrumbSchema, type BreadcrumbItem } from '@/lib/schema';
import { JsonLd } from '@/components/shared/JsonLd';
import { Icon } from '@/components/ui/Icon';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className="glass-soft border-b border-white/40">
        <div className="container-page py-3">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm">
            {items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              return (
                <li key={item.url} className="flex items-center gap-1.5">
                  {idx === 0 && (
                    <Icon name="home" size={14} className="text-warm-400" aria-hidden />
                  )}
                  {isLast ? (
                    <span aria-current="page" className="font-medium text-secondary">
                      {item.name}
                    </span>
                  ) : (
                    <>
                      <Link
                        href={item.url}
                        className="text-secondary/60 transition-colors duration-200 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <Icon name="chevron-right" size={14} className="text-warm-300" aria-hidden />
                    </>
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
