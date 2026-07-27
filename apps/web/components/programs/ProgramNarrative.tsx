import { useLocale } from 'next-intl';
import type { Locale, LocalizedField } from '@unm/types';
import { cn, localized } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

interface Props {
  eyebrow?: string;
  title: string;
  body?: LocalizedField;
  bullets?: LocalizedField[];
}

export function ProgramNarrative({ eyebrow, title, body, bullets }: Props) {
  const locale = useLocale() as Locale;
  const bodyText = body ? localized(body, locale) : '';
  const hasBullets = Boolean(bullets && bullets.length > 0);
  if (!bodyText && !hasBullets) return null;

  return (
    <section className="card-flat p-6 sm:p-8">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={cn('font-display text-display-md text-secondary', eyebrow && 'mt-3')}>
        {title}
      </h2>
      {bodyText ? (
        <p className="mt-5 max-w-3xl leading-relaxed text-secondary/80">{bodyText}</p>
      ) : null}
      {hasBullets ? (
        <ul className="mt-6 space-y-3">
          {bullets!.map((b, i) => (
            <li key={i} className="flex max-w-3xl gap-3 text-secondary/90">
              <Icon name="check-circle" size={20} className="mt-0.5 shrink-0 text-primary" />
              <span className="leading-relaxed">{localized(b, locale)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
