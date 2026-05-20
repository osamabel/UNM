import { cn } from '@/lib/utils';

/**
 * UNM logo.
 * - `variant="full"` serves the official wordmark from /public/logo-unm.svg.
 * - `variant="mark"` is an inline mark-only fallback for mobile (≤375 px).
 *
 * Brand rule: the logo must always appear on a white or warm-50 background.
 * Never recolour, rotate, or stretch the official wordmark.
 */

interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
  // tone only applies to the inline mark fallback; the official SVG is fixed.
  tone?: 'primary' | 'secondary' | 'inherit';
}

export function Logo({ variant = 'full', className, tone = 'primary' }: LogoProps) {
  if (variant === 'mark') {
    const fill =
      tone === 'primary'
        ? '#B5341A'
        : tone === 'secondary'
          ? '#3D1A0B'
          : 'currentColor';
    return (
      <svg
        viewBox="0 0 64 64"
        role="img"
        aria-label="UNM"
        className={cn('h-10 w-10', className)}
      >
        <rect width="64" height="64" rx="12" fill={fill} />
        <path
          fill="#FDFAF7"
          d="M20 18h6v18c0 3.3 2.7 6 6 6s6-2.7 6-6V18h6v18c0 6.6-5.4 12-12 12s-12-5.4-12-12z"
        />
      </svg>
    );
  }

  // The wordmark embeds a raster, so we let the browser load it as a regular
  // SVG asset (Next/Image's optimiser does nothing useful for embedded
  // bitmaps inside an SVG and adds latency).
  return (
    <img
      src="/logo-unm.svg"
      alt="Université Numérique du Maroc"
      width={200}
      height={92}
      className={cn('h-10 w-auto select-none', className)}
      loading="eager"
      decoding="async"
    />
  );
}
