import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, placeholder, id: idProp, required, className, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-heading text-sm font-medium text-secondary">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-primary">*</span>}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          required={required}
          className={cn(
            'h-11 w-full appearance-none rounded border border-warm-200 bg-warm-50 px-3 pr-10',
            'font-body text-ink',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30',
            error && 'border-primary-700',
            className,
          )}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
        >
          <path fill="currentColor" d="M5.5 7.5 10 12l4.5-4.5z" />
        </svg>
      </div>
      {error && (
        <p role="alert" className="text-xs font-medium text-primary-700">
          {error}
        </p>
      )}
    </div>
  );
});
