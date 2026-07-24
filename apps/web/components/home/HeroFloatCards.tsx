'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { getEbsLogoSrc } from '@/lib/partner-logos';
import { cn } from '@/lib/utils';
import type { Locale, Partner } from '@unm/types';

interface Props {
  partners?: Partner[];
}

const CARD_COUNT = 2;
const AUTO_MS = 5200;
const EBS_WORDMARK_SRC = '/partners/ebs/logo-european.svg';

export function HeroFloatCards({ partners = [] }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const isEn = locale === 'en';
  const ebsLogo = getEbsLogoSrc(partners);
  const partnersHref = isEn ? '/en/partners' : '/partenaires';
  const programsHref = isEn ? '/en/programs' : '/programmes';

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActive(((index % CARD_COUNT) + CARD_COUNT) % CARD_COUNT);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % CARD_COUNT);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const partnerCard = (
    <>
      <div className="hero-cred-logo">
        <Image
          src={EBS_WORDMARK_SRC}
          alt={ebsLogo.name}
          width={296}
          height={120}
          className="hero-cred-logo-img"
          priority
        />
      </div>

      <div className="hero-cred-year-block">
        <p className="hero-cred-since">{t('heroPartnerSince')}</p>
        <p className="hero-cred-year">{t('heroPartnerYear')}</p>
      </div>

      <p className="hero-cred-body">{t('heroPartnerShort')}</p>

      <div className="hero-cred-cities" aria-hidden>
        <span>Paris</span>
        <span>Dublin</span>
        <span>{isEn ? 'Barcelona' : 'Barcelone'}</span>
      </div>

      <Link href={partnersHref} className="hero-cred-link">
        {t('heroPartnerCta')}
        <Icon name="arrow-right" size={14} />
      </Link>
    </>
  );

  const programCards = [
    {
      key: 'mba' as const,
      code: 'MBA',
      hint: 'heroTrackMba' as const,
      href: isEn ? '/en/programs?type=MBA' : '/programmes?type=MBA',
    },
    {
      key: 'dba' as const,
      code: 'DBA',
      hint: 'heroTrackDba' as const,
      href: isEn
        ? '/en/programs/dba-business-administration'
        : '/programmes/dba-business-administration',
    },
    {
      key: 'cert' as const,
      code: t('heroProgramsCert'),
      hint: 'heroTrackCert' as const,
      href: programsHref,
    },
  ];

  const programsCard = (
    <>
      <p className="hero-cred-kicker">{t('heroProgramsTitle')}</p>
      <div className="hero-cred-program-cards">
        {programCards.map((card) => (
          <Link key={card.key} href={card.href} className="hero-cred-program-card">
            <span className="hero-cred-program-code">{card.code}</span>
            <span className="hero-cred-program-desc">{t(card.hint)}</span>
            <span className="hero-cred-program-arrow" aria-hidden>
              <Icon name="arrow-right" size={14} />
            </span>
          </Link>
        ))}
      </div>
      <Link href={programsHref} className="hero-cred-link">
        {t('heroProgramsCta')}
        <Icon name="arrow-right" size={14} />
      </Link>
    </>
  );

  const cards: { id: string; content: ReactNode; label: string }[] = [
    { id: 'partner', content: partnerCard, label: ebsLogo.name },
    { id: 'programs', content: programsCard, label: t('heroProgramsTitle') },
  ];

  return (
    <div
      className="hero-float-scene"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      aria-label={t('heroFloatLabel')}
      aria-roledescription="carousel"
    >
      <div className="hero-float-deck">
        {/* Decorative back peek — never interactive */}
        <div className="hero-cred-panel hero-cred-panel--peek" aria-hidden />

        {cards.map((card, index) => {
          const isFront = index === active;
          return (
            <article
              key={card.id}
              className={cn('hero-cred-panel', isFront ? 'is-front' : 'is-hidden')}
              aria-hidden={!isFront}
              data-active={isFront || undefined}
            >
              {isFront ? card.content : null}
            </article>
          );
        })}
      </div>

      <div className="hero-float-controls">
        <button
          type="button"
          className="hero-float-nav"
          onClick={prev}
          aria-label={isEn ? 'Previous card' : 'Carte précédente'}
        >
          <Icon name="chevron-left" size={18} />
        </button>
        <div className="hero-float-dots" role="tablist" aria-label={t('heroFloatLabel')}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={active === index}
              className={cn('hero-float-dot', active === index && 'is-active')}
              onClick={() => goTo(index)}
            >
              <span className="sr-only">{card.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="hero-float-nav"
          onClick={next}
          aria-label={isEn ? 'Next card' : 'Carte suivante'}
        >
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
    </div>
  );
}
