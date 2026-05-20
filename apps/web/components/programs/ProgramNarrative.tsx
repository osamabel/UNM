import { useLocale } from 'next-intl';
import type { Locale, LocalizedField } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  eyebrow?: string;
  title: string;
  body?: LocalizedField;
  /** Optional list of bullets to display after the body paragraph. */
  bullets?: LocalizedField[];
}

/**
 * Editorial narrative section — used for Public-cible, Débouchés
 * professionnels, Compétences acquises, Admission, etc.
 * Renders nothing when the body and bullets are both empty.
 */
export function ProgramNarrative({ eyebrow, title, body, bullets }: Props) {
  const locale = useLocale() as Locale;
  const bodyText = body ? localized(body, locale) : '';
  const hasBullets = bullets && bullets.length > 0;
  if (!bodyText && !hasBullets) return null;
  return (
    <section>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 font-display text-2xl text-secondary">{title}</h2>
      {bodyText && (
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-secondary">
          {bodyText}
        </p>
      )}
      {hasBullets && (
        <ul className="mt-6 space-y-3">
          {bullets!.map((b, i) => (
            <li key={i} className="flex max-w-3xl gap-3 text-secondary">
              <span aria-hidden="true" className="mt-3 h-1 w-3 flex-shrink-0 bg-primary" />
              <span>{localized(b, locale)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
