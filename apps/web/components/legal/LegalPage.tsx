import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { LegalBlock, LegalDocument, LegalSection } from '@/lib/legal/types';
import { LEGAL_DOCUMENTS } from '@/lib/legal';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { localized, formatDate } from '@/lib/utils';
import type { Locale } from '@unm/types';

interface Props {
  doc: LegalDocument;
}

// LegalPage — institutional reader with a sticky table of contents
// on the left and the document body in a generous editorial column.
export function LegalPage({ doc }: Props) {
  const locale = useLocale() as Locale;
  const isEn = locale === 'en';

  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          {
            name: isEn ? 'Legal' : 'Légal',
            url: isEn ? '/en/legal-notice' : '/mentions-legales',
          },
          {
            name: localized(doc.title, locale),
            url: isEn ? doc.href.en : doc.href.fr,
          },
        ]}
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="bg-secondary text-warm-50">
        <div className="container-page py-16 lg:py-20">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary-200">
            {isEn ? 'Legal document' : 'Document légal'}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-display-lg text-warm-50">
            {localized(doc.title, locale)}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-warm-100">
            {localized(doc.intro, locale)}
          </p>
          <p className="mt-8 font-sans text-xs uppercase tracking-[0.18em] text-warm-300">
            {isEn ? 'Last updated' : 'Dernière mise à jour'} ·{' '}
            {formatDate(doc.lastUpdated, locale)}
          </p>
        </div>
      </section>

      {/* ── DOCUMENTS SWITCHER ─────────────────────────────── */}
      <nav
        aria-label={isEn ? 'Legal documents' : 'Documents légaux'}
        className="border-b border-warm-200 bg-warm-50"
      >
        <div className="container-page flex flex-wrap gap-x-1 gap-y-0">
          {LEGAL_DOCUMENTS.map((d) => {
            const active = d.key === doc.key;
            return (
              <Link
                key={d.key}
                href={isEn ? d.href.en : d.href.fr}
                aria-current={active ? 'page' : undefined}
                className={`relative px-4 py-4 font-sans text-sm font-medium transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-secondary-400 hover:text-secondary'
                }`}
              >
                {localized(d.shortLabel, locale)}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 -bottom-px h-0.5 bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── READER (TOC + BODY) ────────────────────────────── */}
      <div className="bg-warm-50">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[260px_1fr] lg:gap-16 lg:py-20">
          {/* TOC */}
          <aside
            aria-label={isEn ? 'Contents' : 'Sommaire'}
            className="lg:sticky lg:top-24 h-fit"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-secondary-400">
              {isEn ? 'Contents' : 'Sommaire'}
            </p>
            <ol className="mt-4 space-y-2 border-l border-warm-200">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block border-l-2 border-transparent -ml-px py-1 pl-4 font-sans text-sm text-secondary-400 hover:border-primary hover:text-primary"
                  >
                    {s.number && (
                      <span className="mr-2 inline-block w-6 text-xs tabular-nums text-secondary">
                        {s.number}
                      </span>
                    )}
                    {localized(s.title, locale)}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          {/* BODY */}
          <article className="min-w-0">
            {doc.sections.map((section) => (
              <Section key={section.id} section={section} locale={locale} />
            ))}

            {/* Footer of the reader — cross-links + back to home */}
            <footer className="mt-16 border-t border-warm-200 pt-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-secondary-400">
                {isEn ? 'Related documents' : 'Documents associés'}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {LEGAL_DOCUMENTS.filter((d) => d.key !== doc.key).map((d) => (
                  <li key={d.key}>
                    <Link
                      href={isEn ? d.href.en : d.href.fr}
                      className="card-flat flex items-start gap-3 p-4 transition-colors hover:border-primary/40"
                    >
                      <span aria-hidden="true" className="text-primary">→</span>
                      <span>
                        <span className="block font-sans text-sm font-medium text-secondary">
                          {localized(d.shortLabel, locale)}
                        </span>
                        <span className="mt-0.5 block text-xs text-secondary-400">
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
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Section + block rendering — editorial typography with serif H2.
// ──────────────────────────────────────────────────────────────────

function Section({ section, locale }: { section: LegalSection; locale: Locale }) {
  return (
    <section
      id={section.id}
      className="mb-12 scroll-mt-24 first:mt-0"
      aria-labelledby={`${section.id}-title`}
    >
      <header className="mb-5">
        {section.number && (
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {section.number}
          </p>
        )}
        <h2
          id={`${section.id}-title`}
          className="mt-2 font-display text-2xl text-secondary sm:text-3xl"
        >
          {localized(section.title, locale)}
        </h2>
      </header>
      <div className="space-y-4">
        {section.blocks.map((b, i) => (
          <Block key={i} block={b} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function Block({ block, locale }: { block: LegalBlock; locale: Locale }) {
  switch (block.type) {
    case 'p':
      return <p className="text-secondary">{localized(block.text, locale)}</p>;
    case 'lead':
      return (
        <p className="font-display text-lg italic leading-relaxed text-secondary sm:text-xl">
          {localized(block.text, locale)}
        </p>
      );
    case 'callout':
      return (
        <aside
          role="note"
          className="rounded-card border-l-2 border-primary bg-warm-100 px-5 py-4 font-sans text-sm text-secondary"
        >
          {localized(block.text, locale)}
        </aside>
      );
    case 'list':
      return (
        <ul className="list-disc space-y-1.5 pl-5 text-secondary marker:text-warm-400">
          {block.items.map((it, i) => (
            <li key={i}>{localized(it, locale)}</li>
          ))}
        </ul>
      );
    case 'definitions':
      return (
        <dl className="space-y-3">
          {block.items.map((it, i) => (
            <div key={i} className="border-l-2 border-warm-200 pl-4">
              <dt className="font-sans text-sm font-semibold text-secondary">
                {localized(it.term, locale)}
              </dt>
              <dd className="mt-1 text-sm text-secondary-400">
                {localized(it.value, locale)}
              </dd>
            </div>
          ))}
        </dl>
      );
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-warm-300 text-left">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="py-2 pr-4 font-sans text-xs font-semibold uppercase tracking-wider text-secondary"
                  >
                    {localized(h, locale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-warm-200/70">
                  {row.map((cell, j) => (
                    <td key={j} className="py-3 pr-4 text-secondary">
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
