'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
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

const STEP_KEYS = ['identity', 'academic', 'program', 'documents', 'recap'] as const;

const FORMAT_LABEL_KEYS: Record<ApplicationData['formatPreference'], string> = {
  Présentiel: 'formatPresentiel',
  Distanciel: 'formatDistanciel',
  Hybride: 'formatHybride',
};

export function ApplicationForm({ faculties, programs }: Props) {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{ cv?: File; diploma?: File; motivation?: File }>({});
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const locale = useLocale() as Locale;
  const t = useTranslations('forms');
  const ta = useTranslations('application');
  const tc = useTranslations('common');
  const searchParams = useSearchParams();

  const stepLabels = useMemo(
    () => STEP_KEYS.map((key) => ta(`steps.${key}`)),
    [ta],
  );

  const methods = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
  });
  const { register, handleSubmit, watch, trigger, setValue, formState: { errors, isSubmitting } } = methods;

  const facultySlug = watch('facultySlug');
  const formValues = watch();
  const filteredPrograms = facultySlug
    ? programs.filter((p) => p.faculty?.slug === facultySlug)
    : programs;

  const formatOptions = useMemo(
    () =>
      (['Présentiel', 'Distanciel', 'Hybride'] as const).map((value) => ({
        value,
        label: ta(FORMAT_LABEL_KEYS[value]),
      })),
    [ta],
  );

  useEffect(() => {
    const programParam = searchParams.get('program');
    if (!programParam) return;
    const match = programs.find((p) => p.slug === programParam);
    if (!match) return;
    setValue('programSlug', match.slug);
    if (match.faculty?.slug) setValue('facultySlug', match.faculty.slug);
  }, [searchParams, programs, setValue]);

  async function next() {
    const fields: (keyof ApplicationData)[][] = [
      ['firstName', 'lastName', 'email', 'phone', 'nationality'],
      ['highestDegree', 'institution', 'graduationYear', 'field'],
      ['facultySlug', 'programSlug', 'formatPreference', 'startDate'],
      [],
      ['consentGiven'],
    ];
    const ok = await trigger(fields[step], { shouldFocus: true });
    if (ok) setStep((s) => Math.min(s + 1, stepLabels.length - 1));
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
      const body = (await res.json()) as { referenceId?: string };
      setReferenceId(body.referenceId ?? null);
      setSubmitted(true);
    } catch {
      setSubmitError(t('errorGeneric'));
    }
  }

  if (submitted) {
    return (
      <div className="rounded-card bg-primary-50 p-8 text-center">
        <h2 className="font-display text-2xl text-secondary">{t('thankYou')}</h2>
        {referenceId && (
          <p className="mt-2 text-secondary-400">
            {ta('referencePrefix')}: {referenceId}
          </p>
        )}
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <ol className="flex flex-wrap gap-1" aria-label="Steps">
          {stepLabels.map((label, i) => (
            <li
              key={STEP_KEYS[i]}
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
              label={ta('faculty')}
              required
              {...register('facultySlug')}
              placeholder="—"
              options={faculties.map((f) => ({ value: f.slug, label: localized(f.name, locale) }))}
            />
            <Select
              label={ta('program')}
              required
              {...register('programSlug')}
              placeholder="—"
              options={filteredPrograms.map((p) => ({ value: p.slug, label: localized(p.title, locale) }))}
            />
            <Select
              label={ta('format')}
              required
              {...register('formatPreference')}
              placeholder="—"
              options={formatOptions}
            />
            <Input label={ta('startDate')} required {...register('startDate')} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <FileField label={ta('cv')} onChange={(f) => setFiles((s) => ({ ...s, cv: f }))} />
            <FileField label={ta('diploma')} onChange={(f) => setFiles((s) => ({ ...s, diploma: f }))} />
            <FileField label={ta('motivation')} onChange={(f) => setFiles((s) => ({ ...s, motivation: f }))} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <ApplicationRecap
              data={formValues}
              files={files}
              faculties={faculties}
              programs={programs}
              locale={locale}
            />
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
          {step < stepLabels.length - 1 ? (
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

function ApplicationRecap({
  data,
  files,
  faculties,
  programs,
  locale,
}: {
  data: Partial<ApplicationData>;
  files: { cv?: File; diploma?: File; motivation?: File };
  faculties: Faculty[];
  programs: Program[];
  locale: Locale;
}) {
  const ta = useTranslations('application');
  const t = useTranslations('forms');

  const faculty = faculties.find((f) => f.slug === data.facultySlug);
  const program = programs.find((p) => p.slug === data.programSlug);
  const formatLabel = data.formatPreference
    ? ta(FORMAT_LABEL_KEYS[data.formatPreference])
    : '—';

  return (
    <div className="space-y-3">
      <p className="font-heading font-semibold text-secondary">{ta('recapTitle')}</p>
      <RecapCard title={ta('steps.identity')}>
        <RecapRow label={t('firstName')} value={`${data.firstName ?? ''} ${data.lastName ?? ''}`.trim()} />
        <RecapRow label={t('email')} value={data.email} />
        <RecapRow label={t('phone')} value={data.phone} />
        <RecapRow label={t('nationality')} value={data.nationality} />
      </RecapCard>
      <RecapCard title={ta('steps.academic')}>
        <RecapRow label={t('highestDegree')} value={data.highestDegree} />
        <RecapRow label={t('institution')} value={data.institution} />
        <RecapRow label={t('graduationYear')} value={data.graduationYear?.toString()} />
        <RecapRow label={t('field')} value={data.field} />
      </RecapCard>
      <RecapCard title={ta('steps.program')}>
        <RecapRow label={ta('faculty')} value={faculty ? localized(faculty.name, locale) : data.facultySlug} />
        <RecapRow label={ta('program')} value={program ? localized(program.title, locale) : data.programSlug} />
        <RecapRow label={ta('format')} value={formatLabel} />
        <RecapRow label={ta('startDate')} value={data.startDate} />
      </RecapCard>
      <RecapCard title={ta('steps.documents')}>
        <RecapRow label={ta('cv')} value={files.cv ? ta('attached') : ta('notAttached')} />
        <RecapRow label={ta('diploma')} value={files.diploma ? ta('attached') : ta('notAttached')} />
        <RecapRow label={ta('motivation')} value={files.motivation ? ta('attached') : ta('notAttached')} />
      </RecapCard>
    </div>
  );
}

function RecapCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-warm-200 bg-warm-50 p-4 text-sm">
      <p className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary-400">{title}</p>
      <dl className="mt-3 space-y-2">{children}</dl>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-secondary-400">{label}</dt>
      <dd className="text-right font-medium text-secondary">{value}</dd>
    </div>
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
