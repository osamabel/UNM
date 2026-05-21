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
    <div className="group flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
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
        className={cn('input-uni', className)}
        required={required}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-warm-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="animate-fade-in text-xs font-medium text-primary-700">
          {error}
        </p>
      )}
    </div>
  );
});
