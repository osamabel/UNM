import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

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
    <div className="group flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
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
          className={cn('input-uni appearance-none pr-11', className)}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-warm-400 transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-primary"
        />
      </div>
      {error && (
        <p role="alert" className="animate-fade-in text-xs font-medium text-primary-700">
          {error}
        </p>
      )}
    </div>
  );
});
