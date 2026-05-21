'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Bottom padding for mobile CTA bar (present on all pages except none — bar is global or per-program). */
export function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasMobileBar =
    !pathname.startsWith('/api') &&
    !pathname.includes('/studio');

  return (
    <main
      id="main"
      className={hasMobileBar ? 'pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0' : undefined}
    >
      {children}
    </main>
  );
}
