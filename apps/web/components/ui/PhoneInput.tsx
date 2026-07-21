'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Locale } from '@unm/types';
import {
  DEFAULT_PHONE_COUNTRY,
  PHONE_COUNTRIES,
  countryFlag,
  formatPhone,
  getPhoneCountry,
  parsePhone,
} from '@/lib/phone-countries';

interface PhoneInputProps {
  label: string;
  locale?: Locale;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  className?: string;
}

export function PhoneInput({
  label,
  locale = 'fr',
  value = '',
  onChange,
  onBlur,
  name,
  required,
  error,
  autoComplete = 'tel',
  className,
}: PhoneInputProps) {
  const id = useId();
  const listId = `${id}-countries`;
  const errorId = `${id}-error`;
  const rootRef = useRef<HTMLDivElement>(null);

  const parsed = parsePhone(value);
  const [countryIso, setCountryIso] = useState(parsed.iso);
  const [localNumber, setLocalNumber] = useState(parsed.local);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = getPhoneCountry(countryIso);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCountries = normalizedQuery
    ? PHONE_COUNTRIES.filter((country) => {
        const label = country.name[locale].toLowerCase();
        return (
          label.includes(normalizedQuery) ||
          country.dial.includes(normalizedQuery) ||
          country.iso.toLowerCase().includes(normalizedQuery)
        );
      })
    : PHONE_COUNTRIES;

  useEffect(() => {
    const next = parsePhone(value);
    setCountryIso(next.iso);
    setLocalNumber(next.local);
  }, [value]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function emit(iso: string, local: string) {
    onChange?.(formatPhone(iso, local));
  }

  function handleCountryPick(iso: string) {
    setCountryIso(iso);
    emit(iso, localNumber);
    setOpen(false);
    setQuery('');
  }

  function handleLocalChange(next: string) {
    const digits = next.replace(/\D/g, '');
    setLocalNumber(digits);
    emit(countryIso, digits);
  }

  return (
    <div ref={rootRef} className={cn('group flex flex-col gap-2', className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-primary">
            *
          </span>
        )}
      </label>

      <div
        className={cn(
          'relative flex overflow-visible rounded-xl border bg-canvas/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-[border-color,box-shadow] duration-200',
          error ? 'border-primary/50' : 'border-warm-200/80',
          'focus-within:border-primary/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10',
        )}
      >
        <div className="relative shrink-0 border-r border-warm-200/80">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 items-center gap-1.5 px-3 text-[15px] font-medium text-secondary transition-colors hover:text-primary sm:h-12"
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {countryFlag(countryIso)}
            </span>
            <span>{selected.dial}</span>
            <span aria-hidden="true" className="text-[10px] text-warm-400">
              ▾
            </span>
          </button>

          {open && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-warm-200/90 bg-white shadow-lg">
              <div className="border-b border-warm-150/80 p-2">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={locale === 'en' ? 'Search country…' : 'Rechercher un pays…'}
                  className="h-9 w-full rounded-lg border border-warm-200/80 bg-canvas/95 px-3 text-sm text-secondary outline-none placeholder:text-secondary/40 focus:border-primary/35 focus:ring-2 focus:ring-primary/10"
                  autoFocus
                />
              </div>
              <ul
                id={listId}
                role="listbox"
                aria-label={locale === 'en' ? 'Country code' : 'Indicatif pays'}
                className="max-h-56 overflow-y-auto py-1"
              >
                {filteredCountries.length === 0 ? (
                  <li className="px-3 py-2.5 text-sm text-secondary/55">
                    {locale === 'en' ? 'No country found' : 'Aucun pays trouvé'}
                  </li>
                ) : (
                  filteredCountries.map((country) => (
                    <li key={country.iso} role="option" aria-selected={country.iso === countryIso}>
                      <button
                        type="button"
                        onClick={() => handleCountryPick(country.iso)}
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-secondary transition-colors hover:bg-warm-50',
                          country.iso === countryIso && 'bg-primary/5 font-medium text-primary',
                        )}
                      >
                        <span className="text-base leading-none">{countryFlag(country.iso)}</span>
                        <span className="tabular-nums">{country.dial}</span>
                        <span className="truncate text-secondary/70">{country.name[locale]}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        <input
          id={id}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-required={required || undefined}
          required={required}
          value={localNumber}
          placeholder={countryIso === DEFAULT_PHONE_COUNTRY ? '6 12 34 56 78' : ''}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={onBlur}
          className="h-11 min-w-0 flex-1 border-0 bg-transparent px-4 text-[15px] text-secondary outline-none placeholder:text-secondary/40 sm:h-12"
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="animate-fade-in text-xs font-medium text-primary-700">
          {error}
        </p>
      )}
    </div>
  );
}
