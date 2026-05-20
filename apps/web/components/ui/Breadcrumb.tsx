import Link from 'next/link';
import { breadcrumbSchema, type BreadcrumbItem } from '@/lib/schema';
import { JsonLd } from '@/components/shared/JsonLd';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className="container-page py-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-secondary-400">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-1">
                {isLast ? (
                  <span aria-current="page" className="font-medium text-secondary">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.url} className="hover:text-primary hover:underline">
                      {item.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
