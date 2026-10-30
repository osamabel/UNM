'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { ProgramCard } from '@/components/patterns/ProgramCard';
import { cn, displayProgramTitle, localized, programPath } from '@/lib/utils';
import {
  matchOrientationPrograms,
  type DiplomaLevel,
  type ExperienceBand,
  type OrientationAnswers,
  type OrientationDomain,
  type OrientationGoal,
  type OrientationMatch,
} from '@/lib/orientation-match';
import { buildOrientationResultsHref, parseOrientationAnswers } from '@/lib/orientation-url';
import type { Locale, Program } from '@unm/types';

type Step = 'profile' | 'goal' | 'domain' | 'success' | 'results';

const EXPERIENCE: ExperienceBand[] = ['0-5', '5-10', '10-15', '15+'];
const DIPLOMAS: DiplomaLevel[] = ['bac3', 'bac5', 'doctorat'];
const DOMAINS: OrientationDomain[] = [
  'finance',
  'marketing',
  'projects',
  'strategy',
  'tourism',
  'public',
  'mining',
  'research',
];
const GOALS: OrientationGoal[] = ['leadership', 'specialization', 'doctorate'];

const leadSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{8,20}$/),
  consentGiven: z.literal(true),
});

type LeadData = z.infer<typeof leadSchema>;

interface Props {
  programs?: Program[];
  mode?: 'page' | 'embed';
}

function OptionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('orientation-option-card', selected && 'is-selected')}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}

function SegmentedSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  getLabel,
}: {
  label: string;
  value: T | null;
  options: readonly T[];
  onChange: (next: T) => void;
  getLabel: (option: T) => string;
}) {
  return (
    <div className="orientation-control">
      <p className="orientation-field-label">{label}</p>
      <div
        className="orientation-segment"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cn('orientation-segment-btn', selected && 'is-selected')}
              onClick={() => onChange(option)}
            >
              {getLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function OrientationWizard({ programs = [], mode = 'page' }: Props) {
  const locale = useLocale() as Locale;
  const isEn = locale === 'en';
  const router = useRouter();
  const t = useTranslations('orientation');
  const tf = useTranslations('forms');
  const tp = useTranslations('program');
  const tProg = useTranslations('programsIndex');
  const params = useSearchParams();
  const embed = mode === 'embed';

  const fromQuery = useMemo(() => parseOrientationAnswers(params), [params]);

  const [step, setStep] = useState<Step>(() =>
    !embed && fromQuery ? 'results' : 'profile',
  );
  const [experience, setExperience] = useState<ExperienceBand | null>(
    () => fromQuery?.experience ?? '5-10',
  );
  const [diploma, setDiploma] = useState<DiplomaLevel | null>(() => fromQuery?.diploma ?? 'bac5');
  const [domain, setDomain] = useState<OrientationDomain | null>(() => fromQuery?.domain ?? null);
  const [goal, setGoal] = useState<OrientationGoal | null>(() => fromQuery?.goal ?? null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [leadDone, setLeadDone] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const answers: OrientationAnswers | null =
    experience && diploma && domain && goal
      ? { experience, diploma, domain, goal }
      : null;

  const matches: OrientationMatch[] = useMemo(() => {
    if (!answers || embed) return [];
    return matchOrientationPrograms(programs, answers, 3);
  }, [programs, answers, embed]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: params.get('fn') ?? '',
      lastName: params.get('ln') ?? '',
      email: params.get('em') ?? '',
      phone: params.get('pn') ?? '',
    },
  });

  const stepIndex =
    step === 'profile' ? 1 : step === 'goal' ? 2 : step === 'domain' || step === 'success' ? 3 : 4;
  const progressTotal = 4;
  const progressPct = Math.min(stepIndex, progressTotal) / progressTotal;
  const admissionsBase = isEn ? '/en/admissions' : '/admissions';
  const contactUrl = isEn ? '/en/contact' : '/contact';

  useEffect(() => {
    if (step !== 'success' || !answers) return;
    const href = buildOrientationResultsHref(locale, answers);
    const timer = window.setTimeout(() => router.push(href), 1400);
    return () => window.clearTimeout(timer);
  }, [step, answers, locale, router]);

  function reasonLabel(key: string): string {
    try {
      return t(`reasons.${key}` as Parameters<typeof t>[0]);
    } catch {
      return key;
    }
  }

  function goBack() {
    if (step === 'goal') setStep('profile');
    else if (step === 'domain') setStep('goal');
    else if (step === 'results') setStep('domain');
  }

  function goToResults() {
    setSelectedSlug(null);
    if (embed) setStep('success');
    else setStep('results');
  }

  async function onLeadSubmit(data: LeadData) {
    setLeadError(null);
    const slug = selectedSlug ?? matches[0]?.program.slug;
    if (!slug) {
      setLeadError(tf('errorGeneric'));
      return;
    }
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          programSlug: slug,
          source: 'orientation',
          medium: 'website',
          campaign: domain ?? 'organic',
          consentGiven: true,
        }),
      });
      if (!res.ok) throw new Error();
      setLeadDone(true);
    } catch {
      setLeadError(tf('errorGeneric'));
    }
  }

  function restart() {
    setStep('profile');
    setExperience('5-10');
    setDiploma('bac5');
    setDomain(null);
    setGoal(null);
    setSelectedSlug(null);
    setLeadDone(false);
    setLeadError(null);
  }

  const showBack = step !== 'profile' && step !== 'success';

  return (
    <div className={cn('orientation-wizard', embed && 'orientation-wizard--embed')}>
      {step !== 'success' && (
        <header className="orientation-card-header">
          <div className="orientation-card-header-row">
            <div>
              <p className="orientation-card-kicker">{t('homeCardTitle')}</p>
              <p className="orientation-card-step">
                {t('stepOf', { current: Math.min(stepIndex, progressTotal), total: progressTotal })}
                {step === 'results' ? ` · ${t('breadcrumb')}` : ''}
              </p>
            </div>
            {showBack && (
              <button
                type="button"
                className="orientation-back-btn"
                onClick={goBack}
                aria-label={t('back')}
              >
                <Icon name="chevron-left" size={18} />
              </button>
            )}
          </div>
          <div className="orientation-progress-bar" aria-hidden>
            <span className="orientation-progress-bar-fill" style={{ width: `${progressPct * 100}%` }} />
          </div>
        </header>
      )}

      {step === 'profile' && (
        <section className="orientation-panel" aria-labelledby="ori-profile-title">
          <h2 id="ori-profile-title" className="orientation-panel-title">
            {t('profileTitle')}
          </h2>

          <div className="orientation-fields">
            <SegmentedSelect
              label={t('diplomaLabel')}
              value={diploma}
              options={DIPLOMAS}
              onChange={setDiploma}
              getLabel={(d) => t(`diploma.${d}`)}
            />
            <SegmentedSelect
              label={t('experienceLabel')}
              value={experience}
              options={EXPERIENCE}
              onChange={setExperience}
              getLabel={(band) => t(`experience.${band}`)}
            />
          </div>

          <div className="orientation-actions orientation-actions--stack">
            <Button
              type="button"
              size="lg"
              fullWidth
              disabled={!experience || !diploma}
              onClick={() => setStep('goal')}
            >
              {t('continue')}
            </Button>
            <p className="orientation-hint">{t('profileHint')}</p>
          </div>
        </section>
      )}

      {step === 'goal' && (
        <section className="orientation-panel" aria-labelledby="ori-goal-title">
          <h2 id="ori-goal-title" className="orientation-panel-title">
            {t('goalTitle')}
          </h2>
          <div className="orientation-option-grid">
            {GOALS.map((g) => (
              <OptionCard
                key={g}
                selected={goal === g}
                onClick={() => {
                  setGoal(g);
                  setStep('domain');
                }}
              >
                <span className="orientation-option-title">{t(`goals.${g}.title`)}</span>
                <span className="orientation-option-hint">{t(`goals.${g}.hint`)}</span>
              </OptionCard>
            ))}
          </div>
          <p className="orientation-hint">{t('goalHint')}</p>
        </section>
      )}

      {step === 'domain' && (
        <section className="orientation-panel" aria-labelledby="ori-domain-title">
          <h2 id="ori-domain-title" className="orientation-panel-title">
            {t('domainTitle')}
          </h2>
          <label className="orientation-select-wrap">
            <span className="orientation-field-label">{t('domainSelectLabel')}</span>
            <div className="orientation-select-shell">
              <select
                className="orientation-select"
                value={domain ?? ''}
                onChange={(e) => setDomain((e.target.value || null) as OrientationDomain | null)}
              >
                <option value="">{t('domainPlaceholder')}</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {t(`domains.${d}`)}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" size={18} className="orientation-select-chevron" />
            </div>
          </label>
          <div className="orientation-actions orientation-actions--stack">
            <Button type="button" size="lg" fullWidth disabled={!domain} onClick={goToResults}>
              {t('seeResults')}
            </Button>
            <p className="orientation-hint">{t('domainHint')}</p>
          </div>
        </section>
      )}

      {step === 'success' && (
        <section className="orientation-success" aria-live="polite">
          <Icon name="check-circle" size={40} className="text-primary" />
          <h2 className="orientation-success-title">{t('successTitle')}</h2>
          <p className="orientation-success-lead">{t('successLead')}</p>
          {answers && (
            <ButtonLink
              href={buildOrientationResultsHref(locale, answers)}
              size="lg"
              fullWidth
              trailingIcon={<Icon name="arrow-right" size={18} />}
            >
              {t('successCta')}
            </ButtonLink>
          )}
        </section>
      )}

      {step === 'results' && !embed && (
        <section className="orientation-panel" aria-labelledby="ori-results-title">
          {matches.length === 0 ? (
            <>
              <h2 id="ori-results-title" className="orientation-panel-title">
                {t('emptyTitle')}
              </h2>
              <div className="orientation-empty-callout">
                <p className="orientation-empty-eyebrow">{t('emptyEyebrow')}</p>
                <p className="orientation-empty-title">{t('emptyHighlight')}</p>
                <p className="orientation-empty-body">{t('empty')}</p>
              </div>
              <div className="orientation-actions orientation-actions--split">
                <ButtonLink href={contactUrl} size="lg">
                  {t('waitlistCta')}
                </ButtonLink>
                <p className="orientation-hint">{t('emptyHint')}</p>
              </div>
            </>
          ) : (
            <>
              <h2 id="ori-results-title" className="orientation-panel-title">
                {matches.some((m) => m.fallback) ? t('fallbackTitle') : t('resultsTitle')}
              </h2>
              <p className="orientation-panel-lead">
                {matches.some((m) => m.fallback) ? t('fallbackLead') : t('resultsLead')}
              </p>

              <ul className="orientation-results-list">
                {matches.map((m, i) => {
                  const title = displayProgramTitle(localized(m.program.title, locale), m.program.type);
                  const selected = (selectedSlug ?? matches[0]?.program.slug) === m.program.slug;
                  return (
                    <li key={m.program.id}>
                      <button
                        type="button"
                        className={cn('orientation-result-card', selected && 'is-selected')}
                        onClick={() => setSelectedSlug(m.program.slug)}
                        aria-pressed={selected}
                      >
                        <span className="orientation-result-rank" aria-hidden>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="orientation-result-body">
                          <p className="orientation-result-type">{m.program.type}</p>
                          <p className="orientation-result-title">{title}</p>
                          <p className="orientation-result-reasons">
                            {m.reasons
                              .filter((r) => r !== 'fallback')
                              .map(reasonLabel)
                              .join(' · ') || t('closestFit')}
                          </p>
                          <Link
                            href={programPath(m.program.slug, locale)}
                            className="orientation-result-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {tProg('exploreProgram')}
                            <Icon name="arrow-right" size={14} />
                          </Link>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="orientation-results-grid" aria-hidden>
                {matches.map((m) => (
                  <ProgramCard
                    key={`card-${m.program.id}`}
                    program={m.program}
                    locale={locale}
                    durationLabel={tp('duration')}
                    formatLabel={tp('format')}
                    exploreLabel={tProg('exploreProgram')}
                    variant="compact"
                  />
                ))}
              </div>

              <div className="orientation-lead">
                <h3 className="orientation-lead-title">{t('leadTitle')}</h3>
                <p className="orientation-lead-lead">{t('leadLead')}</p>

                {leadDone ? (
                  <div className="orientation-lead-success">
                    <Icon name="check-circle" size={28} className="text-primary" />
                    <p>{tf('thankYou')}</p>
                    <ButtonLink
                      href={`${admissionsBase}?program=${encodeURIComponent(
                        selectedSlug ?? matches[0].program.slug,
                      )}`}
                      size="lg"
                      trailingIcon={<Icon name="arrow-right" size={18} />}
                    >
                      {t('applyCta')}
                    </ButtonLink>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onLeadSubmit)}
                    className="orientation-lead-form"
                    noValidate
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label={tf('firstName')}
                        required
                        {...register('firstName')}
                        error={errors.firstName && tf('errorRequired')}
                      />
                      <Input
                        label={tf('lastName')}
                        required
                        {...register('lastName')}
                        error={errors.lastName && tf('errorRequired')}
                      />
                    </div>
                    <Input
                      label={tf('email')}
                      type="email"
                      required
                      {...register('email')}
                      error={errors.email && tf('errorEmail')}
                    />
                    <Input
                      label={tf('phone')}
                      type="tel"
                      required
                      {...register('phone')}
                      error={errors.phone && tf('errorPhone')}
                    />
                    <label className="orientation-consent">
                      <input
                        type="checkbox"
                        {...register('consentGiven')}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
                        required
                      />
                      <span>{tf('consent')}</span>
                    </label>
                    {errors.consentGiven && (
                      <p className="text-xs text-primary-700">{tf('errorRequired')}</p>
                    )}
                    {leadError && <p className="text-sm text-primary-700">{leadError}</p>}
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      size="lg"
                      fullWidth
                      trailingIcon={<Icon name="send" size={18} />}
                    >
                      {t('leadSubmit')}
                    </Button>
                  </form>
                )}
              </div>
            </>
          )}

          <div className="orientation-actions">
            <Button type="button" variant="ghost" onClick={restart}>
              {t('restart')}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
