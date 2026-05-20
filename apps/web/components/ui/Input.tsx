import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id: idProp, required, className, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="font-heading text-sm font-medium text-secondary"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-primary">
            *
          </span>
        )}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
        }
        aria-required={required || undefined}
        className={cn(
          'h-11 rounded border border-warm-200 bg-warm-50 px-3 font-body text-ink',
          'placeholder:text-warm-400',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30',
          error && 'border-primary-700 focus:border-primary-700 focus:ring-primary-700/30',
          className,
        )}
        required={required}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-warm-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-primary-700">
          {error}
        </p>
      )}
    </div>
  );
});
