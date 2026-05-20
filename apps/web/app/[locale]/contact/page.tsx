import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ContactForm } from '@/components/forms/ContactForm';
import { CallbackForm } from '@/components/forms/CallbackForm';
import type { Locale } from '@unm/types';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: 'Contact' };
}

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

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const isEn = params.locale === 'en';
  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: 'Contact', url: isEn ? '/en/contact' : '/contact' },
        ]}
      />
      <SectionWrapper>
        <h1 className="font-display text-display-lg text-secondary">
          {isEn ? 'Contact us' : 'Nous contacter'}
        </h1>
        <p className="mt-3 max-w-2xl text-secondary-400">
          {isEn
            ? "Our admissions team replies within 48 hours. You can also call us or use WhatsApp directly."
            : 'Notre équipe Admissions vous répond sous 48 heures. Vous pouvez aussi nous appeler ou écrire sur WhatsApp.'}
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-2xl text-secondary">
              {isEn ? 'Send us a message' : 'Envoyez-nous un message'}
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
            <h2 className="mt-12 font-display text-2xl text-secondary">
              {isEn ? 'Request a callback' : 'Demander un rappel'}
            </h2>
            <div className="mt-6">
              <CallbackForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-card border border-warm-200 bg-white p-6">
              <h3 className="font-heading font-semibold text-secondary">
                {isEn ? 'Direct lines' : 'Lignes directes'}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href={`tel:${PHONE.replace(/\s/g, '')}`}
                    className="font-medium text-primary hover:underline"
                  >
                    📞 {PHONE}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(isEn ? 'Hello UNM, I would like more information.' : 'Bonjour UNM, je souhaite des informations.')}`}
                    className="font-medium text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@unm.ma"
                    className="font-medium text-primary hover:underline"
                  >
                    ✉ contact@unm.ma
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-card border border-warm-200 bg-white p-6">
              <h3 className="font-heading font-semibold text-secondary">
                {isEn ? 'Campus Marrakech' : 'Campus Marrakech'}
              </h3>
              <p className="mt-2 text-sm text-secondary-400">
                Borj Menara I<br />
                Av. Abdelkrim El Khattabi<br />
                Marrakech, Maroc
              </p>
            </div>

            <div className="rounded-card border border-warm-200 bg-white p-6">
              <h3 className="font-heading font-semibold text-secondary">
                {isEn ? 'Campus Laâyoune' : 'Campus Laâyoune'}
              </h3>
              <p className="mt-2 text-sm text-secondary-400">
                N°8, Al Bouchra<br />
                Av. Alfourssane<br />
                Laâyoune, Maroc
              </p>
            </div>

            <div className="overflow-hidden rounded-card border border-warm-200">
              <iframe
                title="Campus Marrakech map"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-8.0606%2C31.5912%2C-7.9606%2C31.6712&amp;layer=mapnik"
                className="h-64 w-full"
              />
            </div>
          </aside>
        </div>

        <h2 className="mt-16 font-display text-display-md text-secondary">FAQ</h2>
        <ul className="mt-6 space-y-4">
          {FAQS.map((f, i) => {
            const item = isEn ? f.en : f.fr;
            return (
              <li key={i} className="rounded-card border border-warm-200 bg-white p-5">
                <p className="font-heading font-semibold text-secondary">{item.q}</p>
                <p className="mt-2 text-sm text-secondary-400">{item.a}</p>
              </li>
            );
          })}
        </ul>
      </SectionWrapper>
    </>
  );
}
