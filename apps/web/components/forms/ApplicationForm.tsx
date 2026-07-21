'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { Locale, Program } from '@unm/types';
import { localized } from '@/lib/utils';
import { PHONE_VALUE_RE } from '@/lib/phone-countries';

const EXPERIENCE_LEVELS = ['0-5', '5-10', '10-15', '15+'] as const;

export const applicationSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z
    .string()
    .min(1)
    .regex(PHONE_VALUE_RE),
  country: z.string().min(2),
  highestDegree: z.string().min(2),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  programSlug: z.string().min(1),
  consentGiven: z.literal(true),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

interface Props {
  programs: Program[];
}

export function ApplicationForm({ programs }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('forms');
  const ta = useTranslations('application');
  const tc = useTranslations('common');
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
  });

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const programParam = searchParams.get('program');
    if (!programParam) return;
    const match = programs.find((p) => p.slug === programParam);
    if (match) setValue('programSlug', match.slug);
  }, [searchParams, programs, setValue]);

  const experienceOptions = EXPERIENCE_LEVELS.map((value) => ({
    value,
    label: ta(`experienceLevels.${value}`),
  }));

  const programOptions = programs.map((p) => ({
    value: p.slug,
    label: localized(p.title, locale),
  }));

  async function onSubmit(data: ApplicationData) {
    setSubmitError(null);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
      const res = await fetch('/api/applications', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const body = (await res.json()) as { referenceId?: string };
      setReferenceId(body.referenceId ?? null);
      setSubmitted(true);
    } catch {
      setSubmitError(t('errorGeneric'));
    }
  }

  const privacyHref = locale === 'en' ? '/en/privacy' : '/confidentialite';

  if (submitted) {
    return (
      <div className="form-panel px-6 py-12 text-center sm:px-10 sm:py-16">
        <span className="icon-box mx-auto h-16 w-16">
          <Icon name="check-circle" size={32} className="text-primary" />
        </span>
        <h2 className="mt-6 font-display text-display-md text-secondary">{t('thankYou')}</h2>
        {referenceId && (
          <p className="mt-3 font-mono text-sm text-secondary/55">
            {ta('referencePrefix')}:{' '}
            <span className="font-semibold text-secondary">{referenceId}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-panel space-y-5 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('lastName')}
          required
          autoComplete="family-name"
          {...register('lastName')}
          error={errors.lastName && t('errorRequired')}
        />
        <Input
          label={t('firstName')}
          required
          autoComplete="given-name"
          {...register('firstName')}
          error={errors.firstName && t('errorRequired')}
        />
        <Input
          label={t('email')}
          type="email"
          required
          autoComplete="email"
          {...register('email')}
          error={errors.email && t('errorEmail')}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              label={t('phone')}
              locale={locale}
              required
              autoComplete="tel"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={
                errors.phone?.type === 'too_small'
                  ? t('errorRequired')
                  : errors.phone
                    ? t('errorPhone')
                    : undefined
              }
            />
          )}
        />
        <Input
          label={t('country')}
          required
          autoComplete="country-name"
          {...register('country')}
          error={errors.country && t('errorRequired')}
        />
        <Input
          label={t('highestDegree')}
          required
          {...register('highestDegree')}
          error={errors.highestDegree && t('errorRequired')}
        />
        <Select
          label={ta('experienceLevel')}
          required
          {...register('experienceLevel')}
          placeholder="—"
          options={experienceOptions}
          error={errors.experienceLevel && t('errorRequired')}
        />
        <Select
          label={ta('program')}
          required
          {...register('programSlug')}
          placeholder="—"
          options={programOptions}
          error={errors.programSlug && t('errorRequired')}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-warm-200/70 bg-white/60 p-4 transition-colors hover:border-primary/25">
        <input
          type="checkbox"
          required
          {...register('consentGiven')}
          className="mt-0.5 h-5 w-5 accent-primary"
        />
        <span className="text-sm leading-relaxed text-secondary">
          {t('consent').split(/politique de confidentialité|privacy policy/i)[0]}
          <Link href={privacyHref} className="text-primary underline underline-offset-2">
            {locale === 'en' ? 'privacy policy' : 'politique de confidentialité'}
          </Link>
          {t('consent').split(/politique de confidentialité|privacy policy/i)[1]}
        </span>
      </label>

      {submitError && (
        <p role="alert" className="flex gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
          <span>{submitError}</span>
        </p>
      )}

      <div className="border-t border-warm-150/70 pt-5">
        <Button
          type="submit"
          loading={isSubmitting}
          size="lg"
          className="w-full justify-center sm:w-auto"
          trailingIcon={<Icon name="send" size={18} />}
        >
          {tc('submit')}
        </Button>
      </div>
    </form>
  );
}
