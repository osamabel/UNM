'use client';

import { usePathname } from 'next/navigation';
import { CTABar } from '@/components/shared/CTABar';

/** Global mobile CTA bar — skipped on program detail pages (they render their own). */
export function MobileBottomBar() {
  const pathname = usePathname();
  const isProgramDetail =
    /^\/programmes\/[^/]+$/.test(pathname) || /^\/en\/programs\/[^/]+$/.test(pathname);

  if (isProgramDetail) return null;
  return <CTABar />;
}
