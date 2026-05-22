import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHeader } from '@/components/patterns/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/forms/ContactForm';
import { CallbackForm } from '@/components/forms/CallbackForm';
import { CTABanner } from '@/components/home/CTABanner';
import type { Locale } from '@unm/types';

const FAQS = [
  {
    fr: { q: 'Quels sont les délais de candidature ?', a: "Deux sessions par an. Les candidatures sont ouvertes en continu — les places sont attribuées sur dossier et entretien." },
    en: { q: 'When are the application deadlines?', a: 'Two intakes per year. Applications are reviewed on a rolling basis, with admission decisions based on file review and interview.' },
  },
  {
    fr: { q: 'Quel diplôme est délivré ?', a: "Le diplôme est délivré par European Business School (EBS Paris) en partenariat avec l'Université Numérique du Maroc." },
    en: { q: 'What diploma is awarded?', a: 'The diploma is awarded by European Business School (EBS Paris) in partnership with the Digital University of Morocco.' },
  },
  {
    fr: { q: 'Quels sont les pré-requis ?', a: "Bac+3 minimum pour les MBA et certificats Executive · Bac+5 pour le DBA. Une expérience professionnelle est recommandée." },
    en: { q: 'What are the prerequisites?', a: "Bachelor's degree for MBAs and Executive certificates · Master's for the DBA. Professional experience is recommended." },
  },
  {
    fr: { q: 'Le programme est-il accessible en activité professionnelle ?', a: 'Oui, les formats sont conçus pour des cadres en activité (en ligne, hybride, weekends et soirs).' },
    en: { q: 'Can I follow the programme while working?', a: 'Yes, formats are designed for working executives (online, hybrid, weekends and evenings).' },
  },
  {
    fr: { q: 'Existe-t-il un programme de bourses ?', a: 'Des bourses au mérite et au besoin sont disponibles selon les promotions. Contactez les admissions pour en savoir plus.' },
    en: { q: 'Is there a scholarship programme?', a: 'Merit and need-based scholarships are available depending on the cohort. Contact admissions to learn more.' },
  },
];

const PHONE = '+212 6 62 62 62 19';
const WHATSAPP_RAW = '212662626219';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  return { title: t('metaTitle'), description: t('intro') };
}

function ContactCard({
  icon,
  title,
  children,
}: {
  icon: 'phone' | 'mail' | 'map-pin' | 'building';
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card-interactive p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="icon-box h-10 w-10 shrink-0">
          <Icon name={icon} size={20} />
        </span>
        <h3 className="font-heading text-sm font-semibold text-secondary">{title}</h3>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-secondary/70">{children}</div>
    </div>
  );
}

function FormBlock({
  icon,
  title,
  hint,
  children,
}: {
  icon: 'send' | 'phone';
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex gap-4">
        <span className="icon-box h-11 w-11 shrink-0">
          <Icon name={icon} size={22} />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-xl text-secondary sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-secondary/55">{hint}</p>
        </div>
      </div>
      <div className="form-panel mt-5 sm:mt-6">{children}</div>
    </section>
  );
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const [t, tb, tc] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: 'contact' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
    getTranslations({ locale: params.locale, namespace: 'common' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const contactUrl = isEn ? '/en/contact' : '/contact';
  const waText = encodeURIComponent(isEn ? 'Hello UNM' : 'Bonjour UNM');

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: contactUrl },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-10 sm:!pb-12">
        <PageHeader
          icon="mail"
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('intro')}
          className="border-0 pb-0"
        />
        <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8">
          <li className="glass-pill flex items-center gap-1.5 text-xs font-medium text-secondary/75">
            <Icon name="mail" size={14} className="text-primary/90" />
            {t('trustResponse')}
          </li>
          <li className="glass-pill flex items-center gap-1.5 text-xs font-medium text-secondary/75">
            <Icon name="phone" size={14} className="text-primary/90" />
            {t('trustPhone')}
          </li>
          <li className="glass-pill flex items-center gap-1.5 text-xs font-medium text-secondary/75">
            <Icon name="map-pin" size={14} className="text-primary/90" />
            {t('trustCampus')}
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <div className="min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:items-start lg:gap-12 xl:gap-14">
          <div className="min-w-0 space-y-10 sm:space-y-12">
            <FormBlock icon="send" title={t('sendMessage')} hint={t('sendMessageHint')}>
              <ContactForm />
            </FormBlock>
            <FormBlock icon="phone" title={t('requestCallback')} hint={t('callbackHint')}>
              <CallbackForm />
            </FormBlock>
          </div>

          <aside className="mt-10 min-w-0 space-y-4 lg:sticky lg:top-28 lg:mt-0">
            <ContactCard icon="phone" title={t('directLines')}>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`tel:${PHONE.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-700"
                  >
                    <Icon name="phone" size={16} />
                    {PHONE}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${WHATSAPP_RAW}?text=${waText}`}
                    className="glass-pill !h-9 w-full justify-center text-xs font-semibold text-secondary/80 hover:!bg-white/90"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tc('whatsapp')}
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@unm.ma"
                    className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-700"
                  >
                    <Icon name="mail" size={16} />
                    contact@unm.ma
                  </a>
                </li>
              </ul>
            </ContactCard>
            <ContactCard icon="map-pin" title={t('campusMarrakech')}>
              <p>
                Borj Menara I
                <br />
                Av. Abdelkrim El Khattabi
                <br />
                Marrakech, Maroc
              </p>
            </ContactCard>
            <ContactCard icon="map-pin" title={t('campusLaayoune')}>
              <p>
                N°8, Al Bouchra
                <br />
                Av. Alfourssane
                <br />
                Laâyoune, Maroc
              </p>
            </ContactCard>
            <div className="card-flat overflow-hidden p-0">
              <p className="sr-only">{t('mapTitle')}</p>
              <iframe
                title={t('mapTitle')}
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-8.0606%2C31.5912%2C-7.9606%2C31.6712&amp;layer=mapnik"
                className="h-52 w-full sm:h-56"
              />
            </div>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="soft">
        <p className="eyebrow">{t('faqEyebrow')}</p>
        <h2 className="mt-3 font-display text-display-md text-secondary">{t('faqTitle')}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {FAQS.map((f, i) => {
            const item = isEn ? f.en : f.fr;
            return (
              <li key={i} className="card-interactive p-5 sm:p-6">
                <p className="flex items-start gap-2.5 font-heading text-sm font-semibold leading-snug text-secondary">
                  <Icon name="book" size={18} className="mt-0.5 shrink-0 text-primary/85" />
                  {item.q}
                </p>
                <p className="mt-3 pl-7 text-sm leading-relaxed text-secondary/60">{item.a}</p>
              </li>
            );
          })}
        </ul>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
