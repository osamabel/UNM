'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';

interface Anchor {
  id: string;
  label: { fr: string; en: string };
}

const ANCHORS: Anchor[] = [
  { id: 'partenaire', label: { fr: 'Partenaire', en: 'Partner' } },
  { id: 'programme', label: { fr: 'Programme', en: 'Programme' } },
  { id: 'objectifs', label: { fr: 'Objectifs', en: 'Objectives' } },
  { id: 'contenu', label: { fr: 'Contenu', en: 'Curriculum' } },
  { id: 'intervenants', label: { fr: 'Intervenants', en: 'Faculty' } },
  { id: 'accreditations', label: { fr: 'Accréditations', en: 'Accreditations' } },
  { id: 'contact', label: { fr: 'Contact', en: 'Contact' } },
];

export function StickyAnchorNav() {
  const locale = useLocale() as Locale;
  const [active, setActive] = useState<string>('partenaire');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = ANCHORS.map((a) => document.getElementById(a.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-30% 0px -65% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label={locale === 'en' ? 'On-page navigation' : 'Sommaire de la page'}
      className={`sticky top-16 z-20 -mt-px border-y border-warm-200 bg-warm-50/95 backdrop-blur transition-opacity duration-200 sm:top-20 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="container-page flex overflow-x-auto">
        <ul className="flex flex-1 gap-1 py-3">
          {ANCHORS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                aria-current={active === a.id ? 'true' : undefined}
                className={`whitespace-nowrap rounded px-3 py-1.5 font-heading text-sm font-medium transition-colors ${
                  active === a.id
                    ? 'bg-primary text-white'
                    : 'text-secondary-400 hover:bg-warm-100 hover:text-secondary'
                }`}
              >
                {a.label[locale]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
