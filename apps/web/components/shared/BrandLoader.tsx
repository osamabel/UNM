import type { ReactNode } from 'react';
import Image from 'next/image';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';
import { cn } from '@/lib/utils';

interface BrandLoaderProps {
  /** Full-screen overlay (route / initial load). */
  fullscreen?: boolean;
  className?: string;
  label?: string;
  /** Optional line under the logo (e.g. typing caption). */
  caption?: ReactNode;
  /** Show the label text under the mark (default true when not sr-only). */
  showLabel?: boolean;
}

/** UNM logo loader — ambient glow, triple rings, soft progress. */
export function BrandLoader({
  fullscreen = false,
  className,
  label = 'Chargement…',
  caption,
  showLabel = true,
}: BrandLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={cn(
        'brand-loader',
        fullscreen && 'brand-loader-fullscreen',
        className,
      )}
    >
      {fullscreen && (
        <div className="brand-loader-bg" aria-hidden="true">
          <span className="brand-loader-orb brand-loader-orb-a" />
          <span className="brand-loader-orb brand-loader-orb-b" />
        </div>
      )}

      <div className="brand-loader-stage">
        <div className="brand-loader-mark">
          <span className="brand-loader-glow" aria-hidden />
          <span className="brand-loader-ring brand-loader-ring-a" aria-hidden />
          <span className="brand-loader-ring brand-loader-ring-b" aria-hidden />
          <span className="brand-loader-ring brand-loader-ring-c" aria-hidden />
          <div className="brand-loader-logo">
            <Image
              src={LOGO_SRC}
              alt={LOGO_ALT}
              width={280}
              height={130}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        <div className="brand-loader-bar" aria-hidden="true">
          <span />
        </div>

        {showLabel && <p className="brand-loader-label">{label}</p>}
        {caption}
        {!showLabel && <span className="sr-only">{label}</span>}
      </div>
    </div>
  );
}
