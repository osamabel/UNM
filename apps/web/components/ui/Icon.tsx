import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const strokeOnly = { fill: 'none' as const };

/**
 * UNM icon set — rounded stroke style (institutional, consistent weight).
 * 24×24 viewBox · round caps · terracotta via currentColor
 */
export type IconName =
  | 'user'
  | 'graduation'
  | 'program'
  | 'document'
  | 'check'
  | 'check-circle'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'upload'
  | 'mail'
  | 'phone'
  | 'globe'
  | 'calendar'
  | 'building'
  | 'alert'
  | 'file'
  | 'edit'
  | 'send'
  | 'search'
  | 'arrow-right'
  | 'home'
  | 'star'
  | 'shield'
  | 'map-pin'
  | 'menu'
  | 'close'
  | 'award'
  | 'users'
  | 'book'
  | 'quote'
  | 'clock'
  | 'newspaper'
  | 'tag'
  | 'sparkles'
  | 'flask';

type StrokePath = ReactNode;

const PATHS: Record<IconName, StrokePath> = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.25" {...strokeOnly} />
      <path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" {...strokeOnly} />
    </>
  ),
  graduation: (
    <>
      <path d="M3 9 12 4l9 5-9 5-9-5Z" {...strokeOnly} />
      <path d="M6 11v4c0 2.5 2.7 4 6 4s6-1.5 6-4v-4" {...strokeOnly} />
      <path d="M21 9v6" {...strokeOnly} />
    </>
  ),
  program: (
    <>
      <path d="M5 7h14M5 12h10M5 17h14" {...strokeOnly} />
      <circle cx="18" cy="12" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  document: (
    <>
      <path d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" {...strokeOnly} />
      <path d="M14 4v4h4M9 13h6M9 17h4" {...strokeOnly} />
    </>
  ),
  file: (
    <>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" {...strokeOnly} />
      <path d="M14 3v5h5M9 13h6M9 17h4" {...strokeOnly} />
    </>
  ),
  check: <path d="M5 12.5 9.5 17 19 7" {...strokeOnly} />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" {...strokeOnly} />
      <path d="M8 12.5 10.5 15 16 9" {...strokeOnly} />
    </>
  ),
  'chevron-left': <path d="M14 6 8 12l6 6" {...strokeOnly} />,
  'chevron-right': <path d="M10 6l6 6-6 6" {...strokeOnly} />,
  'chevron-down': <path d="M6 9l6 6 6-6" {...strokeOnly} />,
  upload: (
    <>
      <path d="M12 15V5M8 9l4-4 4 4" {...strokeOnly} />
      <path d="M4 19h16" {...strokeOnly} />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" {...strokeOnly} />
      <path d="m3 7 9 6 9-6" {...strokeOnly} />
    </>
  ),
  phone: (
    <path
      d="M8 3h2l1.5 4.5-2 1.2a11 11 0 0 0 5.3 5.3l1.2-2L20 13v2a2 2 0 0 1-2 2A15 15 0 0 1 7 5a2 2 0 0 1 2-2Z"
      {...strokeOnly}
    />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" {...strokeOnly} />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...strokeOnly} />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="1.5" {...strokeOnly} />
      <path d="M8 3v3M16 3v3M4 10h16" {...strokeOnly} />
    </>
  ),
  building: (
    <>
      <path d="M4 20V9l8-5 8 5v11" {...strokeOnly} />
      <path d="M9 20v-6h6v6M4 20h16" {...strokeOnly} />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 20h20L12 3Z" {...strokeOnly} />
      <path d="M12 10v4M12 18h.01" {...strokeOnly} />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l9.5-9.5a2 2 0 0 0 0-2.8L14.3 4.3a2 2 0 0 0-2.8 0L4 12v8Z" {...strokeOnly} />
      <path d="m13.5 6.5 2 2" {...strokeOnly} />
    </>
  ),
  send: <path d="M3 12 21 3M3 12l7 2M3 12l7 7" {...strokeOnly} />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" {...strokeOnly} />
      <path d="m18 18 3 3" {...strokeOnly} />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h12" {...strokeOnly} />
      <path d="m13 6 6 6-6 6" {...strokeOnly} />
    </>
  ),
  home: (
    <>
      <path d="M4 11 12 4l8 7" {...strokeOnly} />
      <path d="M6 11v9h5v-5h2v5h5v-9" {...strokeOnly} />
    </>
  ),
  star: <path d="M12 3 14.5 9.5 21 10l-5 4.5 1.5 7.5L12 18l-5.5 4 1.5-7.5-5-4.5 6.5-.5L12 3Z" {...strokeOnly} />,
  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-3Z" {...strokeOnly} />
      <path d="M9 12.5 11 14.5 15 10" {...strokeOnly} />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" {...strokeOnly} />
      <circle cx="12" cy="11" r="2" {...strokeOnly} />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" {...strokeOnly} />,
  close: <path d="M6 6l12 12M18 6 6 18" {...strokeOnly} />,
  award: (
    <>
      <circle cx="12" cy="9" r="5" {...strokeOnly} />
      <path d="M8.5 14 6 21l6-3 6 3-2.5-7" {...strokeOnly} />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="2.5" {...strokeOnly} />
      <circle cx="16" cy="9" r="2" {...strokeOnly} />
      <path d="M4 19c0-2.5 2.2-4.5 5-4.5M15 19c0-2 1.5-3.5 3.5-3.5" {...strokeOnly} />
    </>
  ),
  book: (
    <>
      <path d="M5 5a2 2 0 0 1 2-2h10v16H7a2 2 0 0 0-2 2V5Z" {...strokeOnly} />
      <path d="M7 3v16a2 2 0 0 0 2 2h9" {...strokeOnly} />
    </>
  ),
  quote: (
    <>
      <path d="M7 11c0-2 1.5-4 4-4v3c-1.5 0-2.5 1-2.5 2.5 0 1.5 1 2.5 2.5 2.5v3H7v-7Z" {...strokeOnly} />
      <path d="M15 11c0-2 1.5-4 4-4v3c-1.5 0-2.5 1-2.5 2.5 0 1.5 1 2.5 2.5 2.5v3h-4v-7Z" {...strokeOnly} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" {...strokeOnly} />
      <path d="M12 7v5l3 2" {...strokeOnly} />
    </>
  ),
  newspaper: (
    <>
      <path d="M6 4h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" {...strokeOnly} />
      <path d="M8 8h8M8 12h6M8 16h8" {...strokeOnly} />
    </>
  ),
  tag: (
    <>
      <path d="m5 5.5 11.5 4 19 11.5 13.5 19 5 11.5V5.5Z" {...strokeOnly} />
      <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" {...strokeOnly} />
      <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" {...strokeOnly} />
    </>
  ),
  flask: (
    <>
      <path d="M10 3h4v5l5 9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2l5-9V3Z" {...strokeOnly} />
      <path d="M9 14h6" {...strokeOnly} />
    </>
  ),
};

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  label?: string;
  weight?: 'normal' | 'medium';
}

export function Icon({ name, className, size = 20, label, weight = 'normal' }: IconProps) {
  const strokeWidth = weight === 'medium' || size <= 16 ? 2 : 1.75;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : 'presentation'}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {PATHS[name]}
      </g>
    </svg>
  );
}

export function IconBox({
  name,
  className,
  iconClassName,
  size = 'md',
  variant = 'default',
}: {
  name: IconName;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dark' | 'outline';
}) {
  const box = { sm: 'h-9 w-9 rounded-lg', md: 'h-11 w-11 rounded-lg', lg: 'h-14 w-14 rounded-xl' }[size];
  const icon = { sm: 18, md: 22, lg: 26 }[size];
  const variants = {
    default: 'icon-box text-primary',
    dark: 'glass-stat text-primary-200 !rounded-xl',
    outline: 'icon-box text-primary',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center transition-transform duration-300 ease-smooth',
        box,
        variants[variant],
        className,
      )}
    >
      <Icon name={name} size={icon} weight="medium" className={iconClassName} />
    </span>
  );
}
