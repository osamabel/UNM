import { cn } from '@/lib/utils';
import { LOGO_ALT, LOGO_SVG } from '@/lib/logo';

interface LogoProps {
  variant?: 'full' | 'mark';
  /** Background the logo sits on — sets matte color + blend mode. */
  surface?: 'light' | 'dark';
  className?: string;
  tone?: 'primary' | 'secondary' | 'inherit';
}

export function Logo({
  variant = 'full',
  surface = 'light',
  className,
  tone = 'primary',
}: LogoProps) {
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

  const isDark = surface === 'dark';

  return (
    <span
      className={cn(
        'logo-wrap inline-flex items-center leading-none',
        isDark ? 'logo-wrap-dark' : 'logo-wrap-light',
        className,
      )}
    >
      <img
        src={LOGO_SVG}
        alt={LOGO_ALT}
        width={200}
        height={92}
        className={cn(
          'logo-wordmark h-9 w-auto max-w-[11rem] select-none sm:max-w-none sm:h-10',
          isDark ? 'logo-blend-dark' : 'logo-blend-light',
        )}
        loading="eager"
        decoding="async"
      />
    </span>
  );
}
