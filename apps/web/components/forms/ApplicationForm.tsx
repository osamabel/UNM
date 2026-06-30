'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Faculty, Locale, Program } from '@unm/types';
import { cn, localized } from '@/lib/utils';

const STEP_ICONS: IconName[] = ['user', 'graduation', 'library', 'document', 'check-circle'];

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
  const stepLabelsShort = useMemo(
    () => STEP_KEYS.map((key) => ta(`stepsShort.${key}`)),
    [ta],
  );
  const totalSteps = stepLabels.length;
  const progressPct = ((step + 1) / totalSteps) * 100;

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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-panel space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/45">
                {ta('stepOf', { current: step + 1, total: totalSteps })}
              </p>
              <h2 className="mt-1 truncate font-display text-xl text-secondary sm:text-2xl">
                {stepLabels[step]}
              </h2>
            </div>
            <span className="shrink-0 font-mono text-xs tabular-nums text-secondary/40">
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="application-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            <div className="application-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>

          <nav aria-label="Steps" className="hidden sm:block">
            <ol className="flex gap-1">
              {stepLabelsShort.map((shortLabel, i) => {
                const done = i < step;
                const active = i === step;
                const canJump = done;
                return (
                  <li key={STEP_KEYS[i]} className="min-w-0 flex-1">
                    <button
                      type="button"
                      disabled={!canJump}
                      aria-current={active ? 'step' : undefined}
                      onClick={() => canJump && setStep(i)}
                      className={cn(
                        'flex w-full flex-col items-center gap-1.5 rounded-lg px-1 py-2 text-center transition-colors',
                        active && 'bg-primary/8',
                        canJump && !active && 'cursor-pointer hover:bg-warm-100/80',
                        !done && !active && 'cursor-default opacity-50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full text-xs',
                          active && 'bg-primary text-white',
                          done && !active && 'bg-primary/15 text-primary',
                          !done && !active && 'bg-warm-200/80 text-secondary/40',
                        )}
                      >
                        {done && !active ? <Icon name="check" size={14} /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          'w-full truncate font-heading text-[10px] font-semibold leading-tight sm:text-[11px]',
                          active ? 'text-primary' : done ? 'text-secondary/70' : 'text-secondary/40',
                        )}
                      >
                        {shortLabel}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('firstName')} required {...register('firstName')} error={errors.firstName && t('errorRequired')} />
            <Input label={t('lastName')} required {...register('lastName')} error={errors.lastName && t('errorRequired')} />
            <Input label={t('email')} type="email" required {...register('email')} error={errors.email && t('errorEmail')} />
            <Input label={t('phone')} type="tel" required {...register('phone')} error={errors.phone && t('errorPhone')} />
            <div className="sm:col-span-2">
              <Input label={t('nationality')} required {...register('nationality')} error={errors.nationality && t('errorRequired')} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('highestDegree')} required {...register('highestDegree')} />
            <Input label={t('institution')} required {...register('institution')} />
            <Input label={t('graduationYear')} type="number" {...register('graduationYear')} />
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
            <Input label={ta('startDate')} type="date" required {...register('startDate')} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <FileField label={ta('cv')} file={files.cv} onChange={(f) => setFiles((s) => ({ ...s, cv: f }))} />
            <FileField label={ta('diploma')} file={files.diploma} onChange={(f) => setFiles((s) => ({ ...s, diploma: f }))} />
            <FileField label={ta('motivation')} file={files.motivation} onChange={(f) => setFiles((s) => ({ ...s, motivation: f }))} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <ApplicationRecap
              data={formValues}
              files={files}
              faculties={faculties}
              programs={programs}
              locale={locale}
              onEditStep={setStep}
            />
            <label className="card-flat flex cursor-pointer items-start gap-3 p-4">
              <input type="checkbox" required {...register('consentGiven')} className="mt-0.5 h-5 w-5 accent-primary" />
              <span className="text-sm leading-relaxed text-secondary">
                {t('consent').split(/politique de confidentialité|privacy policy/i)[0]}
                <Link href={privacyHref} className="text-primary underline underline-offset-2">
                  {locale === 'en' ? 'privacy policy' : 'politique de confidentialité'}
                </Link>
                {t('consent').split(/politique de confidentialité|privacy policy/i)[1]}
              </span>
            </label>
          </div>
        )}

        {submitError && (
          <p role="alert" className="card-flat flex gap-2 border-l-4 border-primary/40 px-4 py-3 text-sm text-primary">
            <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
            <span>{submitError}</span>
          </p>
        )}

        <div className="divider-fine flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-center sm:w-auto"
              leadingIcon={<Icon name="chevron-left" size={18} />}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              {tc('previous')}
            </Button>
          ) : (
            <span className="hidden sm:block" />
          )}
          {step < stepLabels.length - 1 ? (
            <Button
              type="button"
              className="w-full justify-center sm:ml-auto sm:w-auto"
              trailingIcon={<Icon name="chevron-right" size={18} />}
              onClick={next}
            >
              {tc('next')}
            </Button>
          ) : (
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full justify-center sm:ml-auto sm:w-auto"
              trailingIcon={<Icon name="send" size={18} />}
            >
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
  onEditStep,
}: {
  data: Partial<ApplicationData>;
  files: { cv?: File; diploma?: File; motivation?: File };
  faculties: Faculty[];
  programs: Program[];
  locale: Locale;
  onEditStep: (n: number) => void;
}) {
  const ta = useTranslations('application');
  const t = useTranslations('forms');

  const faculty = faculties.find((f) => f.slug === data.facultySlug);
  const program = programs.find((p) => p.slug === data.programSlug);
  const formatLabel = data.formatPreference
    ? ta(FORMAT_LABEL_KEYS[data.formatPreference])
    : '—';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl text-secondary">{ta('recapTitle')}</h3>
        <p className="mt-1 text-sm text-secondary/60">{ta('recapIntro')}</p>
      </div>
      <RecapCard title={ta('steps.identity')} step={0} onEdit={onEditStep} editLabel={ta('editSection')}>
        <RecapRow label={ta('fullName')} value={[data.firstName, data.lastName].filter(Boolean).join(' ')} />
        <RecapRow label={t('email')} value={data.email} />
        <RecapRow label={t('phone')} value={data.phone} />
        <RecapRow label={t('nationality')} value={data.nationality} />
      </RecapCard>
      <RecapCard title={ta('steps.academic')} step={1} onEdit={onEditStep} editLabel={ta('editSection')}>
        <RecapRow label={t('highestDegree')} value={data.highestDegree} />
        <RecapRow label={t('institution')} value={data.institution} />
        <RecapRow label={t('graduationYear')} value={data.graduationYear?.toString()} />
        <RecapRow label={t('field')} value={data.field} />
      </RecapCard>
      <RecapCard title={ta('steps.program')} step={2} onEdit={onEditStep} editLabel={ta('editSection')}>
        <RecapRow label={ta('faculty')} value={faculty ? localized(faculty.name, locale) : data.facultySlug} />
        <RecapRow label={ta('program')} value={program ? localized(program.title, locale) : data.programSlug} />
        <RecapRow label={ta('format')} value={formatLabel} />
        <RecapRow label={ta('startDate')} value={data.startDate} />
      </RecapCard>
      <RecapCard title={ta('steps.documents')} step={3} onEdit={onEditStep} editLabel={ta('editSection')}>
        <DocRow label={ta('cv')} file={files.cv} ok={ta('attached')} no={ta('notAttached')} />
        <DocRow label={ta('diploma')} file={files.diploma} ok={ta('attached')} no={ta('notAttached')} />
        <DocRow label={ta('motivation')} file={files.motivation} ok={ta('attached')} no={ta('notAttached')} />
      </RecapCard>
    </div>
  );
}

function RecapCard({
  title,
  children,
  step,
  onEdit,
  editLabel,
}: {
  title: string;
  children: ReactNode;
  step: number;
  onEdit: (n: number) => void;
  editLabel: string;
}) {
  return (
    <div className="card-flat overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-warm-100 bg-warm-50/80 px-4 py-3">
        <p className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary">{title}</p>
        <button type="button" onClick={() => onEdit(step)} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <Icon name="edit" size={14} />
          {editLabel}
        </button>
      </div>
      <dl className="divide-y divide-warm-100 px-4 text-sm">{children}</dl>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-3">
      <dt className="text-secondary-400">{label}</dt>
      <dd className="text-right font-medium text-secondary">{value?.trim() || '—'}</dd>
    </div>
  );
}

function DocRow({ label, file, ok, no }: { label: string; file?: File; ok: string; no: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <span className="text-secondary-400">{label}</span>
      <span className="flex items-center gap-2">
        {file && <span className="max-w-[140px] truncate text-xs text-secondary-400">{file.name}</span>}
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', file ? 'bg-primary-50 text-primary-700' : 'bg-warm-100 text-warm-500')}>
          {file ? ok : no}
        </span>
      </span>
    </div>
  );
}

function FileField({
  label,
  file,
  onChange,
}: {
  label: string;
  file?: File;
  onChange: (f: File) => void;
}) {
  const t = useTranslations('forms');
  const id = label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="card-flat border-dashed p-4 hover:border-primary/40">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-4">
        <span className="icon-box h-10 w-10 shrink-0">
          <Icon name="upload" size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading text-sm font-medium text-secondary">{label}</span>
          <span className="mt-1 block text-xs text-secondary-400">PDF, PNG, JPG</span>
          <span className={cn('mt-3 inline-flex rounded border px-3 py-1.5 text-sm', file ? 'border-primary-200 bg-primary-50 text-primary-800' : 'border-warm-200 text-secondary')}>
            {file ? file.name : t('chooseFile')}
          </span>
        </span>
        <input id={id} type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only" onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])} />
      </label>
    </div>
  );
}
