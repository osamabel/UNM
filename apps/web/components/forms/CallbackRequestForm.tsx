'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@unm/types';

// ════════════════════════════════════════════════════════════════
// Lightweight callback request — designed for the sidebar modal.
// 4 short fields max (5 with consent). Email is optional to keep
// friction low: a callback request is fulfilled by phone, not email.
// ════════════════════════════════════════════════════════════════

const schema = z.object({
  firstName: z.string().min(2, 'min2'),
  lastName: z.string().min(2, 'min2'),
  phone: z.string().regex(/^\+?[0-9\s\-()]{8,20}$/, 'phone'),
  email: z.string().email('email').or(z.literal('')).optional(),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'consent' }),
  }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  /** Slug of the programme the user is currently looking at. */
  programSlug: string;
  /** Localised programme title — shown in the success message. */
  programTitle: string;
  /** Called on successful submission so the parent (modal) can close. */
  onSuccess?: () => void;
}

export function CallbackRequestForm({ programSlug, programTitle, onSuccess }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('forms');
  const tc = useTranslations('common');
  const params = useSearchParams();

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          programSlug,
          source: params.get('utm_source') ?? 'callback',
          medium: params.get('utm_medium') ?? 'sidebar',
          campaign: params.get('utm_campaign') ?? programSlug,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      // Let the user read the success message for a beat before closing.
      setTimeout(() => onSuccess?.(), 2500);
    } catch {
      setServerError(t('errorGeneric'));
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div
          aria-hidden="true"
          className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
        >
          ✓
        </div>
        <p className="font-display text-xl text-secondary">
          {locale === 'en' ? 'Thank you!' : 'Merci !'}
        </p>
        <p className="mt-2 text-sm text-secondary-400">
          {locale === 'en'
            ? `Our team will call you back within 48 hours about the ${programTitle}.`
            : `Notre équipe vous rappelle sous 48 h au sujet du ${programTitle}.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <p className="text-sm text-secondary-400">
        {locale === 'en'
          ? 'Leave us your number — we call back within 48 hours.'
          : 'Laissez-nous votre numéro — nous vous rappelons sous 48 h.'}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label={t('firstName')}
          required
          autoComplete="given-name"
          {...register('firstName')}
          error={errors.firstName ? t('errorRequired') : undefined}
        />
        <Input
          label={t('lastName')}
          required
          autoComplete="family-name"
          {...register('lastName')}
          error={errors.lastName ? t('errorRequired') : undefined}
        />
      </div>

      <Input
        label={t('phone')}
        type="tel"
        required
        placeholder="+212 6 00 00 00 00"
        autoComplete="tel"
        {...register('phone')}
        error={errors.phone ? t('errorPhone') : undefined}
      />

      <Input
        label={`${t('email')} (${tc('optional').toLowerCase()})`}
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email ? t('errorEmail') : undefined}
      />

      <label className="flex items-start gap-2 pt-1 text-xs text-secondary-400">
        <input
          type="checkbox"
          {...register('consentGiven')}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primary"
          required
        />
        <span>{t('consent')}</span>
      </label>
      {errors.consentGiven && (
        <p className="text-xs text-primary-700">{t('errorRequired')}</p>
      )}

      {serverError && (
        <p role="alert" className="text-sm text-primary-700">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} fullWidth>
        {locale === 'en' ? 'Request a callback' : 'Être rappelé'}
      </Button>

      <p className="text-[11px] text-secondary-400 text-center">
        {locale === 'en'
          ? `For: ${programTitle}`
          : `Au sujet du : ${programTitle}`}
      </p>
    </form>
  );
}
