'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { getBrandLogoSrc } from '@/lib/site-settings';

interface LogoProps {
  variant?: 'full' | 'mark';
  /**
   * Surface the logo sits on:
   * - light → nav / light panels (logo as-is)
   * - dark  → footer / dark panels (wordmark recolored white, no light tile)
   */
  surface?: 'light' | 'dark';
  className?: string;
  tone?: 'primary' | 'secondary' | 'inherit';
  /** Override CMS / default src (rare). */
  src?: string;
}

/** Full wordmark — prefers CMS Site Settings → brandLogo, else local fallback. */
export function Logo({ variant = 'full', surface = 'light', className, src }: LogoProps) {
  const isMark = variant === 'mark';
  const onDark = surface === 'dark';
  const settings = useSiteSettings();
  const logoSrc = src ?? getBrandLogoSrc(settings) ?? LOGO_SRC;

  return (
    <span
      className={cn(
        'logo-wrap inline-flex shrink-0 items-center justify-center',
        onDark && 'logo-wrap-footer',
        className,
      )}
    >
      <Image
        src={logoSrc}
        alt={LOGO_ALT}
        width={isMark ? 240 : 400}
        height={isMark ? 111 : 185}
        quality={100}
        unoptimized={logoSrc.startsWith('/cms-media/')}
        sizes={onDark ? '296px' : '(max-width: 640px) 200px, (max-width: 1280px) 260px, 320px'}
        className={cn(
          'w-auto object-contain object-left select-none',
          isMark && 'logo-mark h-12 max-w-[8.5rem]',
          !isMark &&
            !onDark &&
            'logo-wordmark h-14 max-w-[15rem] sm:h-16 sm:max-w-[17.5rem] 2xl:h-[4.5rem] 2xl:max-w-[20rem]',
          onDark &&
            !isMark &&
            'logo-wordmark h-auto w-full max-w-[18.5rem]',
        )}
        priority
      />
    </span>
  );
}
