'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Faculty, Locale, Program } from '@unm/types';
import { localized } from '@/lib/utils';

export const applicationSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{8,15}$/),
  nationality: z.string().min(2),
  highestDegree: z.string().min(2),
  institution: z.string().min(2),
  graduationYear: z.coerce.number().min(1970).max(new Date().getFullYear()),
  field: z.string().min(2),
  facultySlug: z.string().min(1),
  programSlug: z.string().min(1),
  formatPreference: z.enum(['Présentiel', 'Distanciel', 'Hybride']),
  startDate: z.string().min(4),
  consentGiven: z.literal(true),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

interface Props {
  faculties: Faculty[];
  programs: Program[];
}

const STEP_LABELS = ['Identité', 'Profil académique', 'Programme', 'Documents', 'Récapitulatif'];

export function ApplicationForm({ faculties, programs }: Props) {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{ cv?: File; diploma?: File; motivation?: File }>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const locale = useLocale() as Locale;
  const t = useTranslations('forms');
  const tc = useTranslations('common');

  const methods = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
  });
  const { register, handleSubmit, watch, trigger, formState: { errors, isSubmitting } } = methods;

  const facultySlug = watch('facultySlug');
  const filteredPrograms = facultySlug
    ? programs.filter((p) => p.faculty?.slug === facultySlug)
    : programs;

  async function next() {
    const fields: (keyof ApplicationData)[][] = [
      ['firstName', 'lastName', 'email', 'phone', 'nationality'],
      ['highestDegree', 'institution', 'graduationYear', 'field'],
      ['facultySlug', 'programSlug', 'formatPreference', 'startDate'],
      [],
      ['consentGiven'],
    ];
    const ok = await trigger(fields[step], { shouldFocus: true });
    if (ok) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  async function onSubmit(data: ApplicationData) {
    setSubmitError(null);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
      if (files.cv) fd.append('cv', files.cv);
      if (files.diploma) fd.append('diploma', files.diploma);
      if (files.motivation) fd.append('motivation', files.motivation);
      const res = await fetch('/api/applications', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError(t('errorGeneric'));
    }
  }

  if (submitted) {
    return (
      <div className="rounded-card bg-primary-50 p-8 text-center">
        <h2 className="font-display text-2xl text-secondary">{t('thankYou')}</h2>
        <p className="mt-2 text-secondary-400">
          {locale === 'en' ? 'Reference: APP-' : 'Référence : APP-'}
          {Math.random().toString(36).slice(2, 8).toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <ol className="flex flex-wrap gap-1" aria-label="Steps">
          {STEP_LABELS.map((label, i) => (
            <li
              key={label}
              aria-current={i === step ? 'step' : undefined}
              className={`flex-1 min-w-[120px] rounded p-2 text-xs font-heading ${
                i === step ? 'bg-primary text-white' : i < step ? 'bg-primary-100 text-primary-700' : 'bg-warm-100 text-secondary'
              }`}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('firstName')} required {...register('firstName')} error={errors.firstName && t('errorRequired')} />
            <Input label={t('lastName')} required {...register('lastName')} error={errors.lastName && t('errorRequired')} />
            <Input label={t('email')} type="email" required {...register('email')} error={errors.email && t('errorEmail')} />
            <Input label={t('phone')} type="tel" required {...register('phone')} error={errors.phone && t('errorPhone')} />
            <Input label={t('nationality')} required {...register('nationality')} error={errors.nationality && t('errorRequired')} />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('highestDegree')} required {...register('highestDegree')} />
            <Input label={t('institution')} required {...register('institution')} />
            <Input label={t('graduationYear')} type="number" required {...register('graduationYear')} />
            <Input label={t('field')} required {...register('field')} />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Faculté"
              required
              {...register('facultySlug')}
              placeholder="—"
              options={faculties.map((f) => ({ value: f.slug, label: localized(f.name, locale) }))}
            />
            <Select
              label="Programme"
              required
              {...register('programSlug')}
              placeholder="—"
              options={filteredPrograms.map((p) => ({ value: p.slug, label: localized(p.title, locale) }))}
            />
            <Select
              label="Format"
              required
              {...register('formatPreference')}
              placeholder="—"
              options={[
                { value: 'Présentiel', label: 'Présentiel' },
                { value: 'Distanciel', label: 'Distanciel' },
                { value: 'Hybride', label: 'Hybride' },
              ]}
            />
            <Input label="Date de rentrée" required {...register('startDate')} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <FileField label="CV" onChange={(f) => setFiles((s) => ({ ...s, cv: f }))} />
            <FileField label="Diplôme" onChange={(f) => setFiles((s) => ({ ...s, diploma: f }))} />
            <FileField label="Lettre de motivation" onChange={(f) => setFiles((s) => ({ ...s, motivation: f }))} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-card bg-warm-100 p-4 text-sm">
              <p className="font-heading font-semibold text-secondary">Récapitulatif</p>
              <pre className="mt-2 whitespace-pre-wrap text-secondary-400">
                {JSON.stringify({ ...watch(), files: Object.keys(files) }, null, 2)}
              </pre>
            </div>
            <label className="flex items-start gap-2 text-sm text-secondary">
              <input type="checkbox" required {...register('consentGiven')} className="mt-1 h-4 w-4 accent-primary" />
              <span>{t('consent')}</span>
            </label>
          </div>
        )}

        {submitError && <p className="text-sm text-primary-700">{submitError}</p>}

        <div className="flex justify-between gap-3 pt-2">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              {tc('previous')}
            </Button>
          ) : <span />}
          {step < STEP_LABELS.length - 1 ? (
            <Button type="button" onClick={next}>
              {tc('next')}
            </Button>
          ) : (
            <Button type="submit" loading={isSubmitting}>
              {tc('submit')}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function FileField({
  label,
  onChange,
}: {
  label: string;
  onChange: (f: File) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-heading text-sm font-medium text-secondary">{label}</span>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
        className="block w-full text-sm text-secondary file:mr-4 file:rounded file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white"
      />
    </label>
  );
}
