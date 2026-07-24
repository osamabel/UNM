'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Locale } from '@unm/types';
import { cn } from '@/lib/utils';

interface Stat {
  value: string;
  labelKey: 'statsStudents' | 'statsPrograms' | 'statsYears' | 'statsPartners';
  icon: IconName;
}

const STATS: Stat[] = [
  { value: '1 500+', labelKey: 'statsStudents', icon: 'users' },
  { value: '20', labelKey: 'statsPrograms', icon: 'library' },
  { value: '10', labelKey: 'statsYears', icon: 'medal' },
  { value: '60+', labelKey: 'statsPartners', icon: 'handshake' },
];

function parseStatDisplay(raw: string) {
  const suffix = raw.replace(/[\d\s]/g, '');
  const value = Number.parseInt(raw.replace(/\D/g, ''), 10) || 0;
  return { value, suffix };
}

function formatStatValue(n: number, suffix: string, locale: Locale) {
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR').format(n);
  return `${formatted}${suffix}`;
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) {
      setCurrent(0);
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setCurrent(target);
      return;
    }

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return current;
}

function AnimatedStat({
  stat,
  label,
  delay,
  locale,
  compact,
  tone,
}: {
  stat: Stat;
  label: string;
  delay: number;
  locale: Locale;
  compact?: boolean;
  tone?: 'dark' | 'light';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const { value: target, suffix } = parseStatDisplay(stat.value);
  const count = useCountUp(target, active);
  const light = tone === 'light';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'text-center',
        light ? 'stat-tile-light' : 'glass-stat',
        compact ? 'px-2.5 py-3.5 sm:px-3 sm:py-4' : 'px-3 py-4 sm:px-4 sm:py-5',
        'transition-all duration-700 ease-smooth motion-reduce:transition-none',
        active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="mx-auto mb-1.5 inline-flex sm:mb-2" aria-hidden>
        <Icon
          name={stat.icon}
          size={compact ? 16 : 18}
          weight="medium"
          className={light ? 'text-primary' : 'text-primary-200'}
        />
      </span>
      <dd
        className={cn(
          'font-display font-semibold tabular-nums',
          light ? 'text-secondary' : 'text-warm-50',
          compact ? 'text-xl sm:text-2xl' : 'text-xl sm:text-2xl',
        )}
      >
        {formatStatValue(count, suffix, locale)}
      </dd>
      <dt
        className={cn(
          'mt-1 text-[10px] font-medium uppercase tracking-[0.12em]',
          light ? 'text-secondary/55' : 'text-warm-300',
        )}
      >
        {label}
      </dt>
    </div>
  );
}

/** Four key figures — used inside hero panel and optional standalone band. */
export function HeroStatsGrid({
  compact = false,
  className,
  tone = 'dark',
}: {
  compact?: boolean;
  className?: string;
  tone?: 'dark' | 'light';
}) {
  const t = useTranslations('home');
  const locale = useLocale() as Locale;

  return (
    <dl className={cn('grid grid-cols-2 gap-2 sm:gap-2.5', className)}>
      {STATS.map((s, i) => (
        <AnimatedStat
          key={s.labelKey}
          stat={s}
          label={t(s.labelKey)}
          delay={i * 80}
          locale={locale}
          compact={compact}
          tone={tone}
        />
      ))}
    </dl>
  );
}

/** Full stats band (e.g. university page). */
export function HeroStatsBand() {
  const t = useTranslations('home');

  return (
    <div className="glass-dark relative overflow-hidden rounded-2xl">
      <div className="hero-panel-pattern absolute inset-0" aria-hidden />
      <div className="relative flex flex-col gap-6 p-6 sm:gap-8 sm:p-8 lg:gap-10 lg:p-12">
        <header className="text-center">
          <span className="inline-flex items-center gap-2">
            <Icon name="medal" size={20} className="text-primary-200" />
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-200">
              UNM
            </p>
          </span>
          <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-200">
            {t('statsEyebrow')}
          </p>
          <h2 className="mt-3 font-display text-display-md text-warm-50 sm:mx-auto sm:max-w-lg">
            {t('statsTitle')}
          </h2>
        </header>

        <HeroStatsGrid className="lg:grid-cols-4" />

        {t('statsSource') && (
          <p className="divider-fine pt-4 text-center text-xs text-warm-400/80 sm:pt-6">
            {t('statsSource')}
          </p>
        )}
      </div>
    </div>
  );
}
