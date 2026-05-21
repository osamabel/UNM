import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

// SVG icons inlined to avoid an extra dep; they pick up currentColor.
const ICONS = [
  // graduation cap — excellence
  <svg key="cap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5a6 3 0 0 0 12 0v-5" />
  </svg>,
  // briefcase — field expertise
  <svg key="briefcase" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>,
  // user-check — personalised
  <svg key="user-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>,
];

export function FacultyPillars() {
  const locale = useLocale() as Locale;
  const { faculty } = dbaContent;
  return (
    <SectionWrapper id="intervenants" tone="default">
      <div className="max-w-3xl">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {localized(faculty.eyebrow, locale)}
        </p>
        <h2 className="mt-3 font-display text-display-lg text-secondary">
          {localized(faculty.title, locale)}
        </h2>
        <p className="mt-4 text-secondary-400">
          {localized(faculty.intro, locale)}
        </p>
      </div>

      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {faculty.pillars.map((p, i) => (
          <li
            key={i}
            className="card-interactive p-8"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary">
              <span className="h-6 w-6 inline-block">{ICONS[i]}</span>
            </div>
            <h3 className="font-display text-xl text-secondary">
              {localized(p.title, locale)}
            </h3>
            <p className="mt-3 text-secondary-400">
              {localized(p.body, locale)}
            </p>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
