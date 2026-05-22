import { cn } from '@/lib/utils';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';

interface LogoProps {
  variant?: 'full' | 'mark';
  /** Kept for API compatibility — transparent PNG works on all surfaces. */
  surface?: 'light' | 'dark';
  className?: string;
  tone?: 'primary' | 'secondary' | 'inherit';
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'mark') {
    return (
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        width={120}
        height={48}
        className={cn(
          'logo-mark h-9 w-auto max-w-[3.25rem] object-left object-contain select-none',
          className,
        )}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      width={240}
      height={64}
      className={cn(
        'logo-wordmark h-9 w-auto max-w-[12rem] select-none sm:h-10 sm:max-w-[14rem]',
        className,
      )}
      loading="eager"
      decoding="async"
    />
  );
}
