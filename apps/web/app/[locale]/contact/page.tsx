import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PhotoHero } from '@/components/patterns/PhotoHero';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { ContactFormsPanel } from '@/components/forms/ContactFormsPanel';
import { CTABanner } from '@/components/home/CTABanner';
import { JsonLd } from '@/components/shared/JsonLd';
import { getSiteSettings } from '@/lib/api';
import { PAGE_HERO_IMAGE } from '@/lib/page-heroes';
import { digitsOnly, mergeSiteSettings } from '@/lib/site-settings';
import { faqSchema } from '@/lib/schema';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  return { title: t('metaTitle'), description: t('intro') };
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [t, tb, tc, rawSettings] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: 'contact' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
    getTranslations({ locale: params.locale, namespace: 'common' }),
    getSiteSettings(),
  ]);
  const settings = mergeSiteSettings(rawSettings);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const contactUrl = isEn ? '/en/contact' : '/contact';
  const admissionsUrl = isEn ? '/en/admissions' : '/admissions';
  const programsUrl = isEn ? '/en/programs' : '/programmes';
  const waText = encodeURIComponent(
    isEn ? 'Hello UNM — I would like some information' : 'Bonjour UNM — je souhaite des informations',
  );
  const phone = settings.contact.phone;
  const phoneTel = digitsOnly(phone);
  const waDigits = digitsOnly(settings.contact.whatsapp);
  const email = settings.contact.email;
  const address = localized(settings.contact.address, params.locale);

  const channels = [
    { icon: 'send' as const, title: t('channelMessageTitle'), body: t('channelMessageBody') },
    { icon: 'phone' as const, title: t('channelCallTitle'), body: t('channelCallBody') },
    { icon: 'mail' as const, title: t('channelWhatsappTitle'), body: t('channelWhatsappBody') },
  ];

  const faqDisplay = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
    { q: t('faq6Q'), a: t('faq6A') },
  ];
  const faqs = faqDisplay.map((item) => ({
    question: { fr: item.q, en: item.q },
    answer: { fr: item.a, en: item.a },
  }));

  return (
    <>
      <JsonLd data={faqSchema(faqs, params.locale)} />

      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: contactUrl },
        ]}
      />

      <PhotoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('intro')}
        imageSrc={PAGE_HERO_IMAGE.contact}
        imageAlt={
          isEn
            ? 'African professionals — contact UNM admissions'
            : 'Professionnels africains — contact admissions UNM'
        }
        imagePosition="center 40%"
      >
        <div className="contact-hero-actions">
          <ButtonLink href="#ecrire" size="lg" trailingIcon={<Icon name="arrow-right" size={18} />}>
            {t('ctaMessage')}
          </ButtonLink>
          {waDigits ? (
            <ButtonLink
              href={`https://wa.me/${waDigits}?text=${waText}`}
              size="lg"
              variant="ghost"
              className="contact-hero-ghost"
              target="_blank"
              rel="noopener noreferrer"
              trailingIcon={<Icon name="send" size={16} />}
            >
              {tc('whatsapp')}
            </ButtonLink>
          ) : null}
        </div>
        <ul className="photo-hero-trust mt-5">
          <li>
            <Icon name="mail" size={14} className="text-[rgba(255,196,170,0.95)]" />
            {t('trustResponse')}
          </li>
          <li>
            <Icon name="phone" size={14} className="text-[rgba(255,196,170,0.95)]" />
            {t('trustPhone')}
          </li>
          <li>
            <Icon name="map-pin" size={14} className="text-[rgba(255,196,170,0.95)]" />
            {t('trustCampus')}
          </li>
        </ul>
      </PhotoHero>

      <SectionWrapper tone="canvas" className="contact-channels !py-9 sm:!py-11">
        <ScrollReveal>
          <p className="contact-kicker">{t('channelsEyebrow')}</p>
          <h2 className="mt-2 font-display text-2xl text-secondary sm:text-3xl">{t('channelsTitle')}</h2>
        </ScrollReveal>
        <ul className="contact-channel-grid mt-7">
          {channels.map((ch, i) => (
            <ScrollReveal key={ch.title} delay={i * 60} as="li" className="contact-channel">
              <span className="contact-channel-icon">
                <Icon name={ch.icon} size={18} />
              </span>
              <div className="min-w-0">
                <h3 className="contact-channel-title">{ch.title}</h3>
                <p className="contact-channel-body">{ch.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </ul>
      </SectionWrapper>

      <SectionWrapper tone="soft" className="!py-11 sm:!py-14" id="ecrire">
        <div className="contact-layout">
          <ScrollReveal>
            <div className="mb-6 max-w-2xl">
              <p className="contact-kicker">{t('formsEyebrow')}</p>
              <h2 className="mt-2 font-display text-2xl text-secondary sm:text-3xl">{t('formsTitle')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary/60">{t('formsHint')}</p>
            </div>
            <ContactFormsPanel />
          </ScrollReveal>

          <aside className="contact-aside">
            <ScrollReveal delay={70}>
              <div className="contact-aside-card">
                <p className="contact-kicker">{t('directLines')}</p>
                <ul className="contact-aside-links mt-4">
                  {phoneTel ? (
                    <li>
                      <a href={`tel:${phoneTel}`} className="contact-aside-link">
                        <Icon name="phone" size={16} />
                        <span>{phone}</span>
                      </a>
                    </li>
                  ) : null}
                  <li>
                    <a href={`mailto:${email}`} className="contact-aside-link">
                      <Icon name="mail" size={16} />
                      <span>{email}</span>
                    </a>
                  </li>
                  {waDigits ? (
                    <li>
                      <a
                        href={`https://wa.me/${waDigits}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-wa"
                      >
                        <Icon name="send" size={15} />
                        {t('whatsappCta')}
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="contact-aside-card">
                <div className="flex items-center gap-3">
                  <span className="icon-box h-10 w-10 shrink-0">
                    <Icon name="map-pin" size={18} />
                  </span>
                  <h3 className="font-heading text-sm font-semibold text-secondary">
                    {t('campusMarrakech')}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-secondary/70 whitespace-pre-line">
                  {address}
                </p>
                <div className="contact-map mt-4 overflow-hidden rounded-xl">
                  <p className="sr-only">{t('mapTitle')}</p>
                  <iframe
                    title={t('mapTitle')}
                    loading="lazy"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-8.0606%2C31.5912%2C-7.9606%2C31.6712&amp;layer=mapnik"
                    className="h-44 w-full"
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={130}>
              <div className="contact-aside-card contact-aside-apply">
                <p className="font-heading text-sm font-semibold text-secondary">{t('applyTitle')}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary/60">{t('applyBody')}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonLink href={admissionsUrl} size="sm" trailingIcon={<Icon name="arrow-right" size={14} />}>
                    {t('applyLink')}
                  </ButtonLink>
                  <Link href={programsUrl} className="contact-aside-secondary">
                    {t('programsLink')}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!py-11 sm:!py-14">
        <ScrollReveal>
          <p className="contact-kicker">{t('faqEyebrow')}</p>
          <h2 className="mt-2 font-display text-2xl text-secondary sm:text-3xl">{t('faqTitle')}</h2>
        </ScrollReveal>
        <ul className="contact-faq mt-8">
          {faqDisplay.map((item, i) => (
            <ScrollReveal key={item.q} delay={i * 40} as="li" className="contact-faq-item">
              <p className="contact-faq-q">
                <Icon name="book" size={18} className="mt-0.5 shrink-0 text-primary/85" />
                {item.q}
              </p>
              <p className="contact-faq-a">{item.a}</p>
            </ScrollReveal>
          ))}
        </ul>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
