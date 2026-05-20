import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

export function ContactDBA() {
  const locale = useLocale() as Locale;
  const { contact } = dbaContent;
  const phoneTel = contact.phone.replace(/\s/g, '');
  const waNumber = contact.phone.replace(/[^0-9]/g, '');
  const waMsg = encodeURIComponent(
    locale === 'en'
      ? 'Hello UNM, I would like more information on the DBA programme.'
      : 'Bonjour UNM, je souhaite des informations sur le programme DBA.',
  );
  return (
    <SectionWrapper id="contact" tone="default">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {localized(contact.eyebrow, locale)}
          </p>
          <h2 className="mt-3 font-display text-display-lg text-secondary">
            {localized(contact.title, locale)}
          </h2>
          <ul className="mt-6 space-y-3 text-secondary">
            <li>
              <a href={`tel:${phoneTel}`} className="font-medium text-primary hover:underline">
                📞 {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                💬 WhatsApp
              </a>
            </li>
            <li>
              <a href={contact.site.href} className="font-medium text-primary hover:underline">
                🌐 {contact.site.label}
              </a>
            </li>
            <li className="text-secondary-400">
              <span className="font-heading text-xs uppercase tracking-wider">
                {locale === 'en' ? 'Social' : 'Réseaux'}
              </span>
              <p className="mt-1 text-secondary">{contact.handle}</p>
            </li>
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {contact.campuses.map((c) => (
            <div key={c.name} className="rounded-card border border-warm-200 bg-white p-6">
              <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">
                {locale === 'en' ? 'Campus' : 'Campus'} {c.name}
              </p>
              <p className="mt-3 text-secondary">{localized(c.address, locale)}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
