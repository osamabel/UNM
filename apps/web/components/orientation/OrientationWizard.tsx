'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
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
import type { Locale, Program } from '@unm/types';

type Step = 'profile' | 'domain' | 'goal' | 'results';

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
  programs: Program[];
}

function ChoiceChip({
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
      className={cn('orientation-chip', selected && 'is-selected')}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}

export function OrientationWizard({ programs }: Props) {
  const locale = useLocale() as Locale;
  const isEn = locale === 'en';
  const t = useTranslations('orientation');
  const tf = useTranslations('forms');
  const tp = useTranslations('program');
  const tProg = useTranslations('programsIndex');
  const params = useSearchParams();

  const [step, setStep] = useState<Step>('profile');
  const [experience, setExperience] = useState<ExperienceBand | null>(null);
  const [diploma, setDiploma] = useState<DiplomaLevel | null>(null);
  const [domain, setDomain] = useState<OrientationDomain | null>(null);
  const [goal, setGoal] = useState<OrientationGoal | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [leadDone, setLeadDone] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const answers: OrientationAnswers | null =
    experience && diploma && domain && goal
      ? { experience, diploma, domain, goal }
      : null;

  const matches: OrientationMatch[] = useMemo(() => {
    if (!answers) return [];
    return matchOrientationPrograms(programs, answers, 3);
  }, [programs, answers]);

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

  const stepIndex = step === 'profile' ? 1 : step === 'domain' ? 2 : step === 'goal' ? 3 : 4;
  const admissionsBase = isEn ? '/en/admissions' : '/admissions';
  const contactUrl = isEn ? '/en/contact' : '/contact';

  function reasonLabel(key: string): string {
    try {
      return t(`reasons.${key}` as Parameters<typeof t>[0]);
    } catch {
      return key;
    }
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
    setExperience(null);
    setDiploma(null);
    setDomain(null);
    setGoal(null);
    setSelectedSlug(null);
    setLeadDone(false);
    setLeadError(null);
  }

  return (
    <div className="orientation-wizard">
      <div className="orientation-progress" aria-label={t('stepOf', { current: stepIndex, total: 4 })}>
        <p className="orientation-progress-label">
          {t('stepOf', { current: stepIndex, total: 4 })}
        </p>
        <div className="orientation-progress-track" aria-hidden>
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={cn('orientation-progress-dot', n <= stepIndex && 'is-active')} />
          ))}
        </div>
      </div>

      {step === 'profile' && (
        <section className="orientation-panel" aria-labelledby="ori-profile-title">
          <h2 id="ori-profile-title" className="orientation-panel-title">
            {t('profileTitle')}
          </h2>
          <p className="orientation-panel-lead">{t('profileLead')}</p>

          <p className="orientation-field-label">{t('experienceLabel')}</p>
          <div className="orientation-chip-grid">
            {EXPERIENCE.map((band) => (
              <ChoiceChip
                key={band}
                selected={experience === band}
                onClick={() => setExperience(band)}
              >
                {t(`experience.${band}`)}
              </ChoiceChip>
            ))}
          </div>

          <p className="orientation-field-label">{t('diplomaLabel')}</p>
          <div className="orientation-chip-grid">
            {DIPLOMAS.map((d) => (
              <ChoiceChip key={d} selected={diploma === d} onClick={() => setDiploma(d)}>
                {t(`diploma.${d}`)}
              </ChoiceChip>
            ))}
          </div>

          <div className="orientation-actions">
            <Button
              type="button"
              size="lg"
              disabled={!experience || !diploma}
              onClick={() => setStep('domain')}
              trailingIcon={<Icon name="arrow-right" size={18} />}
            >
              {t('continue')}
            </Button>
          </div>
        </section>
      )}

      {step === 'domain' && (
        <section className="orientation-panel" aria-labelledby="ori-domain-title">
          <h2 id="ori-domain-title" className="orientation-panel-title">
            {t('domainTitle')}
          </h2>
          <p className="orientation-panel-lead">{t('domainLead')}</p>
          <div className="orientation-chip-grid orientation-chip-grid--wide">
            {DOMAINS.map((d) => (
              <ChoiceChip key={d} selected={domain === d} onClick={() => setDomain(d)}>
                {t(`domains.${d}`)}
              </ChoiceChip>
            ))}
          </div>
          <div className="orientation-actions">
            <Button type="button" variant="ghost" onClick={() => setStep('profile')}>
              {t('back')}
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={!domain}
              onClick={() => setStep('goal')}
              trailingIcon={<Icon name="arrow-right" size={18} />}
            >
              {t('continue')}
            </Button>
          </div>
        </section>
      )}

      {step === 'goal' && (
        <section className="orientation-panel" aria-labelledby="ori-goal-title">
          <h2 id="ori-goal-title" className="orientation-panel-title">
            {t('goalTitle')}
          </h2>
          <p className="orientation-panel-lead">{t('goalLead')}</p>
          <div className="orientation-chip-grid orientation-chip-grid--wide">
            {GOALS.map((g) => (
              <ChoiceChip key={g} selected={goal === g} onClick={() => setGoal(g)}>
                <span className="orientation-chip-title">{t(`goals.${g}.title`)}</span>
                <span className="orientation-chip-hint">{t(`goals.${g}.hint`)}</span>
              </ChoiceChip>
            ))}
          </div>
          <div className="orientation-actions">
            <Button type="button" variant="ghost" onClick={() => setStep('domain')}>
              {t('back')}
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={!goal}
              onClick={() => {
                setSelectedSlug(null);
                setStep('results');
              }}
              trailingIcon={<Icon name="arrow-right" size={18} />}
            >
              {t('seeResults')}
            </Button>
          </div>
        </section>
      )}

      {step === 'results' && (
        <section className="orientation-panel" aria-labelledby="ori-results-title">
          <h2 id="ori-results-title" className="orientation-panel-title">
            {matches.some((m) => m.fallback) ? t('fallbackTitle') : t('resultsTitle')}
          </h2>
          <p className="orientation-panel-lead">
            {matches.some((m) => m.fallback) ? t('fallbackLead') : t('resultsLead')}
          </p>

          {matches.length === 0 ? (
            <div className="orientation-empty">
              <p>{t('empty')}</p>
              <ButtonLink href={contactUrl} size="lg">
                {t('contactCta')}
              </ButtonLink>
            </div>
          ) : (
            <>
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
            <Button type="button" variant="ghost" onClick={() => setStep('goal')}>
              {t('back')}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
