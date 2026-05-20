'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Locale, Program } from '@unm/types';
import { localized } from '@/lib/utils';

const schema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{8,15}$/),
  programSlug: z.string().min(1),
  consentGiven: z.literal(true),
});

type FormData = z.infer<typeof schema>;

interface Props {
  programs: Program[];
  defaultProgramSlug?: string;
}

export function LeadForm({ programs, defaultProgramSlug }: Props) {
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
    defaultValues: { programSlug: defaultProgramSlug ?? '' },
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: params.get('utm_source') ?? 'direct',
          medium: params.get('utm_medium') ?? 'website',
          campaign: params.get('utm_campaign') ?? 'organic',
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setServerError(t('errorGeneric'));
    }
  };

  if (submitted) {
    const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[^0-9]/g, '');
    return (
      <div className="rounded-card bg-primary-50 p-6 text-center">
        <p className="font-heading text-secondary">{t('thankYou')}</p>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex"
          >
            <Button variant="secondary">WhatsApp</Button>
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('firstName')}
          required
          {...register('firstName')}
          error={errors.firstName && t('errorRequired')}
        />
        <Input
          label={t('lastName')}
          required
          {...register('lastName')}
          error={errors.lastName && t('errorRequired')}
        />
      </div>
      <Input
        label={t('email')}
        type="email"
        required
        {...register('email')}
        error={errors.email && t('errorEmail')}
      />
      <Input
        label={t('phone')}
        type="tel"
        required
        {...register('phone')}
        error={errors.phone && t('errorPhone')}
      />
      <Select
        label={t('programInterest')}
        required
        placeholder="—"
        {...register('programSlug')}
        error={errors.programSlug && t('errorRequired')}
        options={programs.map((p) => ({
          value: p.slug,
          label: localized(p.title, locale),
        }))}
      />
      <label className="flex items-start gap-2 text-sm text-secondary">
        <input
          type="checkbox"
          {...register('consentGiven')}
          className="mt-1 h-4 w-4 accent-primary"
          required
        />
        <span>{t('consent')}</span>
      </label>
      {errors.consentGiven && (
        <p className="text-xs text-primary-700">{t('errorRequired')}</p>
      )}
      {serverError && <p className="text-sm text-primary-700">{serverError}</p>}
      <Button type="submit" loading={isSubmitting} fullWidth>
        {tc('submit')}
      </Button>
    </form>
  );
}
