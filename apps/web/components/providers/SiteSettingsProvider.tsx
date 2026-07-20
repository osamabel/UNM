'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SiteSettings } from '@unm/types';
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-settings';

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
