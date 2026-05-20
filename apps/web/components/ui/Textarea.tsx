import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, id: idProp, required, className, ...rest }, ref) {
    const autoId = useId();
    const id = idProp ?? autoId;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="font-heading text-sm font-medium text-secondary">
          {label}
          {required && <span aria-hidden="true" className="ml-1 text-primary">*</span>}
        </label>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          required={required}
          rows={4}
          className={cn(
            'min-h-[120px] rounded border border-warm-200 bg-warm-50 px-3 py-2 font-body text-ink',
            'placeholder:text-warm-400',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30',
            error && 'border-primary-700',
            className,
          )}
          {...rest}
        />
        {error && (
          <p role="alert" className="text-xs font-medium text-primary-700">
            {error}
          </p>
        )}
      </div>
    );
  },
);
