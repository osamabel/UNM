'use client';

import { PhotoHero } from '@/components/patterns/PhotoHero';
import { PAGE_HERO_IMAGE } from '@/lib/page-heroes';

type ManifesteHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt?: string;
};

/** Manifeste page hero — African UNM photography by default. */
export function ManifesteHero({
  eyebrow,
  title,
  subtitle,
  imageSrc = PAGE_HERO_IMAGE.manifesto,
  imageAlt = '',
}: ManifesteHeroProps) {
  return (
    <PhotoHero
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      imagePosition="center 28%"
      className="photo-hero--tall"
    />
  );
}
