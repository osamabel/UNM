'use client';

import dynamic from 'next/dynamic';

/** Client-only splash — never SSR, avoids hydration DOM fights. */
const Splash = dynamic(
  () => import('@/components/shared/InitialLoader').then((m) => m.InitialLoader),
  { ssr: false },
);

export function InitialLoaderClient() {
  return <Splash />;
}
