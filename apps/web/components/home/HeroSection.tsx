'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { HeroFloatCards } from '@/components/home/HeroFloatCards';
import { cn } from '@/lib/utils';
import type { Locale, Partner } from '@unm/types';

const HERO_POSTER_SRC = '/hero-home.jpg';
const HERO_VIDEO_SRC = '/homevideo.mp4';

interface Props {
  partners?: Partner[];
}

export function HeroSection({ partners = [] }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const isEn = locale === 'en';
  const gradAlt = isEn
    ? 'UNM graduates celebrating their achievement'
    : 'Diplômés UNM célébrant leur réussite';

  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (imgRef.current?.complete) setPosterReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAutoplay(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    const play = () => {
      video.muted = true;
      video.volume = 0;
      void video.play().catch(() => {
        /* Poster image stays visible if autoplay is blocked */
      });
    };

    if (video.readyState >= 2) play();
    else video.addEventListener('loadeddata', play, { once: true });

    return () => video.removeEventListener('loadeddata', play);
  }, [autoplay]);

  const showVideo = autoplay && videoReady;

  return (
    <section
      id="hero"
      className="hero-bg-photo relative scroll-mt-24 overflow-hidden"
      aria-label={gradAlt}
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          ref={imgRef}
          src={HERO_POSTER_SRC}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          onLoad={() => setPosterReady(true)}
          className={cn(
            'hero-bg-poster hero-bg-image object-cover transition-opacity duration-[1200ms] ease-out motion-reduce:transition-none',
            posterReady && !showVideo ? 'opacity-100' : 'opacity-0',
          )}
        />

        {autoplay ? (
          <video
            ref={videoRef}
            className={cn(
              'hero-bg-video hero-bg-image object-cover transition-opacity duration-[1200ms] ease-out motion-reduce:transition-none',
              showVideo ? 'opacity-100' : 'opacity-0',
            )}
            autoPlay
            muted
            defaultMuted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER_SRC}
            disablePictureInPicture
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onVolumeChange={() => {
              const video = videoRef.current;
              if (!video) return;
              video.muted = true;
              video.volume = 0;
            }}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : null}
      </div>

      <div className="hero-bg-scrub pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-bg-vignette pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-page relative z-10 min-w-0">
        <div className="hero-stage">
          <div className="hero-enter hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-rule" aria-hidden />
              <p>{t('heroEyebrow')}</p>
            </div>

            <h1 className="hero-title">{t('heroTitle')}</h1>

            <p className="hero-subtitle">{t('heroSubtitle')}</p>

            <p className="hero-story">{t('heroStory')}</p>

            <div className="hero-actions">
              <ButtonLink
                href={isEn ? '/en/programs' : '/programmes'}
                size="lg"
                className="hero-cta-primary w-full sm:w-auto"
                trailingIcon={<Icon name="arrow-right" size={18} />}
              >
                {t('heroCta1')}
              </ButtonLink>
              <ButtonLink
                href={isEn ? '/en/admissions' : '/admissions'}
                variant="ghost"
                size="lg"
                className="hero-cta-secondary w-full sm:w-auto"
              >
                {t('heroCta2')}
              </ButtonLink>
            </div>
          </div>

          <HeroFloatCards partners={partners} />
        </div>
      </div>
    </section>
  );
}
