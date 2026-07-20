import Image from 'next/image';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';
import { cn } from '@/lib/utils';

interface BrandLoaderProps {
  /** Full-screen overlay (route / initial load). */
  fullscreen?: boolean;
  className?: string;
  label?: string;
}

/** UNM logo loader — soft pulse + thin progress ring. */
export function BrandLoader({
  fullscreen = false,
  className,
  label = 'Chargement…',
}: BrandLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={cn(
        'flex flex-col items-center justify-center gap-6',
        fullscreen &&
          'fixed inset-0 z-[100] bg-[var(--unm-canvas)]',
        className,
      )}
    >
      <div className="brand-loader-mark relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
        <span className="brand-loader-ring absolute inset-0" aria-hidden />
        <span className="brand-loader-ring brand-loader-ring-delayed absolute inset-2" aria-hidden />
        <div className="brand-loader-logo relative z-[1] flex h-[4.5rem] w-[4.5rem] items-center justify-center sm:h-20 sm:w-20">
          <Image
            src={LOGO_SRC}
            alt={LOGO_ALT}
            width={160}
            height={74}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
