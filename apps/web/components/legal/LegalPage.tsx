'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { LegalBlock, LegalDocument, LegalSection } from '@/lib/legal/types';
import { LEGAL_DOCUMENTS } from '@/lib/legal';
import { iconForLegalDocument } from '@/lib/legal-icons';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Icon } from '@/components/ui/Icon';
import { localized, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Locale } from '@unm/types';

interface Props {
  doc: LegalDocument;
}

export function LegalPage({ doc }: Props) {
  const locale = useLocale() as Locale;
  const isEn = locale === 'en';
  const t = useTranslations('legalPage');
  const legalHub = isEn ? '/en/legal-notice' : '/mentions-legales';

  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: t('breadcrumbLegal'), url: legalHub },
          {
            name: localized(doc.title, locale),
            url: isEn ? doc.href.en : doc.href.fr,
          },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-8 sm:!pb-10">
        <p className="eyebrow">{t('eyebrow')}</p>
        <div className="mt-3 h-0.5 w-10 bg-primary/80" aria-hidden />
        <h1 className="mt-5 max-w-4xl font-display text-3xl leading-tight text-secondary sm:text-4xl lg:text-display-lg">
          {localized(doc.title, locale)}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-secondary/70 sm:text-lg">
          {localized(doc.intro, locale)}
        </p>
        <p className="glass-pill mt-6 inline-flex text-xs font-medium text-secondary/75">
          <Icon name="calendar" size={14} className="shrink-0 text-primary/80" />
          {t('lastUpdated')} · {formatDate(doc.lastUpdated, locale)}
        </p>
      </SectionWrapper>

      <nav
        aria-label={t('documentsNav')}
        className="sticky top-[var(--header-offset,4.5rem)] z-20 border-b border-warm-150/50 bg-canvas/90 backdrop-blur-md"
      >
        <div className="container-page min-w-0 py-3">
          <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LEGAL_DOCUMENTS.map((d) => {
              const active = d.key === doc.key;
              const icon = iconForLegalDocument(d.key);
              return (
                <li key={d.key} className="shrink-0">
                  <Link
                    href={isEn ? d.href.en : d.href.fr}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'glass-pill inline-flex gap-1.5 text-xs font-semibold transition-colors sm:text-sm',
                      active
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/25'
                        : 'text-secondary/70 hover:bg-white/90 hover:text-secondary',
                    )}
                  >
                    <Icon name={icon} size={14} className="shrink-0" />
                    {localized(d.shortLabel, locale)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-14">
          <aside aria-label={t('contents')} className="min-w-0 lg:sticky lg:top-36 lg:self-start">
            <div className="card-flat p-5 sm:p-6">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/50">
                {t('contents')}
              </p>
              <ol className="mt-4 space-y-1 border-l border-warm-200/80 pl-3">
                {doc.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block border-l-2 border-transparent py-1.5 pl-3 text-sm text-secondary/65 transition-colors hover:border-primary hover:text-primary"
                    >
                      {s.number && (
                        <span className="mr-2 inline-block w-6 font-mono text-[10px] tabular-nums text-secondary/45">
                          {s.number}
                        </span>
                      )}
                      {localized(s.title, locale)}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="min-w-0">
            {doc.sections.map((section) => (
              <LegalSectionBlock key={section.id} section={section} locale={locale} />
            ))}

            <footer className="mt-14 border-t border-warm-150/60 pt-8 sm:mt-16">
              <p className="eyebrow">{t('related')}</p>
              <ul className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
                {LEGAL_DOCUMENTS.filter((d) => d.key !== doc.key).map((d) => (
                  <li key={d.key}>
                    <Link
                      href={isEn ? d.href.en : d.href.fr}
                      className="card-interactive flex h-full items-start gap-3 p-4 sm:p-5"
                    >
                      <span className="icon-box h-9 w-9 shrink-0">
                        <Icon name={iconForLegalDocument(d.key)} size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-heading text-sm font-semibold text-secondary">
                          {localized(d.shortLabel, locale)}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-secondary/55 line-clamp-2">
                          {localized(d.title, locale)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </footer>
          </article>
        </div>
      </SectionWrapper>
    </>
  );
}

function LegalSectionBlock({ section, locale }: { section: LegalSection; locale: Locale }) {
  return (
    <section
      id={section.id}
      className="mb-10 scroll-mt-32 first:mt-0 sm:mb-12"
      aria-labelledby={`${section.id}-title`}
    >
      <header className="mb-5">
        {section.number && (
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            {section.number}
          </p>
        )}
        <h2
          id={`${section.id}-title`}
          className="mt-2 font-display text-2xl leading-snug text-secondary sm:text-3xl"
        >
          {localized(section.title, locale)}
        </h2>
      </header>
      <div className="space-y-4 text-[15px] leading-relaxed text-secondary/85 sm:text-base">
        {section.blocks.map((b, i) => (
          <LegalBlockView key={i} block={b} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function LegalBlockView({ block, locale }: { block: LegalBlock; locale: Locale }) {
  switch (block.type) {
    case 'p':
      return <p>{localized(block.text, locale)}</p>;
    case 'lead':
      return (
        <p className="card-flat border-l-4 border-primary/35 px-5 py-4 font-display text-lg italic leading-relaxed text-secondary sm:text-xl">
          {localized(block.text, locale)}
        </p>
      );
    case 'callout':
      return (
        <aside
          role="note"
          className="card-flat flex gap-3 border-l-4 border-primary/40 px-5 py-4 text-sm text-secondary/85"
        >
          <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>{localized(block.text, locale)}</span>
        </aside>
      );
    case 'list':
      return (
        <ul className="list-disc space-y-2 pl-5 marker:text-primary/60">
          {block.items.map((it, i) => (
            <li key={i}>{localized(it, locale)}</li>
          ))}
        </ul>
      );
    case 'definitions':
      return (
        <dl className="space-y-3">
          {block.items.map((it, i) => (
            <div key={i} className="card-flat px-4 py-3">
              <dt className="font-heading text-sm font-semibold text-secondary">
                {localized(it.term, locale)}
              </dt>
              <dd className="mt-1 text-sm text-secondary/65">{localized(it.value, locale)}</dd>
            </div>
          ))}
        </dl>
      );
    case 'table':
      return (
        <div className="card-flat overflow-x-auto p-0">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-warm-200 bg-warm-50/50 text-left">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/55"
                  >
                    {localized(h, locale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-warm-150/60 last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-secondary/85">
                      {localized(cell, locale)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
