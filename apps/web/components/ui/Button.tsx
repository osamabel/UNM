import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-uni-primary',
  secondary: 'btn-uni-secondary',
  ghost: 'btn-uni-ghost',
  danger: 'btn-uni-danger',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 min-h-9 px-4 text-xs rounded-lg',
  md: 'h-11 min-h-11 px-5 text-sm rounded-lg',
  lg: 'h-12 min-h-12 px-7 text-[15px] rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth,
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'btn-uni group',
        variantClass[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        leadingIcon
      )}
      <span>{children}</span>
      {!loading && trailingIcon && (
        <span className="btn-arrow inline-flex">{trailingIcon}</span>
      )}
    </button>
  );
});

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'className'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  leadingIcon,
  trailingIcon,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        'btn-uni group',
        variantClass[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon && <span className="btn-arrow inline-flex">{trailingIcon}</span>}
    </Link>
  );
}
