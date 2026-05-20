// ════════════════════════════════════════════════════════════════
// UNM Organisations page — official editorial content.
// FR is the source of truth; EN is kept in sync line by line.
// All copy lives here (no hard-coded strings in the section components).
// ════════════════════════════════════════════════════════════════

import type { LocalizedField } from '@unm/types';

const t = (fr: string, en: string): LocalizedField => ({ fr, en });

export interface PillarItem { title: LocalizedField; body: LocalizedField }
export interface BulletItem { text: LocalizedField }
export interface CtaItem { label: LocalizedField; href: string }

export interface OrganisationsContent {
  meta: { title: LocalizedField; description: LocalizedField; canonicalPath: { fr: string; en: string } };
  hero: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    tagline: LocalizedField;
    paragraphs: LocalizedField[];
    ctas: { primary: CtaItem; secondary: CtaItem };
  };
  threeWays: { eyebrow: LocalizedField; title: LocalizedField; items: PillarItem[] };
  custom: { title: LocalizedField; paragraphs: LocalizedField[]; subTitle: LocalizedField; bullets: BulletItem[]; closing: LocalizedField };
  cohorts: { title: LocalizedField; paragraphs: LocalizedField[]; subTitle: LocalizedField; bullets: BulletItem[] };
  academies: { title: LocalizedField; paragraphs: LocalizedField[]; subTitle: LocalizedField; bullets: BulletItem[] };
  partners: { eyebrow: LocalizedField; title: LocalizedField; intro: LocalizedField; categories: PillarItem[] };
  experience: { eyebrow: LocalizedField; title: LocalizedField; pillars: PillarItem[] };
  closing: { title: LocalizedField; body: LocalizedField; ctas: { primary: CtaItem; secondary: CtaItem } };
}

export const organisationsContent: OrganisationsContent = {
  meta: {
    title: t('Programmes pour les organisations | UNM', 'Programs for Organizations | UNM'),
    description: t(
      "L'UNM conçoit des programmes Executive sur mesure pour ministères, collectivités et grandes entreprises africaines. Formez vos dirigeants.",
      'UNM designs tailored Executive programs for African ministries, territories and corporations. Develop leaders who transform institutions.',
    ),
    canonicalPath: { fr: '/organisations', en: '/en/organizations' },
  },

  hero: {
    eyebrow: t('Organisations', 'Organizations'),
    title: t('Programmes pour les organisations', 'Programs for Organizations'),
    tagline: t(
      'Formez les dirigeants qui transforment vos institutions.',
      'Build the leaders who will transform your institution.',
    ),
    paragraphs: [
      t(
        "L'UNM accompagne les organisations africaines dans la transformation de leurs équipes dirigeantes. Ministères, collectivités territoriales, agences publiques, grandes entreprises, banques, opérateurs internationaux : nous co-construisons des dispositifs de formation Executive ancrés dans vos enjeux stratégiques.",
        'UNM partners with organizations across Africa to develop the leadership their transformation requires. Ministries, territorial authorities, public agencies, large corporations, banks and international operators turn to us for Executive learning anchored in their strategic priorities.',
      ),
      t(
        "Notre approche repose sur trois leviers : un savoir académique de haut niveau adossé à notre partenariat avec European Business School (EBS, Paris · Barcelone · Berlin), une pédagogie 100 % numérique compatible avec le rythme des cadres en exercice, et une contextualisation systématique aux réalités africaines.",
        'Our approach rests on three foundations: rigorous academic content backed by our partnership with European Business School (EBS, Paris · Barcelona · Berlin), fully digital pedagogy that fits the schedules of working executives, and systematic grounding in African realities.',
      ),
    ],
    ctas: {
      primary: { label: t('Échanger avec un conseiller', 'Speak with an advisor'), href: '/contact?subject=organisations' },
      secondary: { label: t('Télécharger la brochure', 'Download the brochure'), href: '#contact' },
    },
  },

  threeWays: {
    eyebrow: t('Modalités', 'Engagement models'),
    title: t('Trois façons de collaborer avec l’UNM', 'Three Ways to Engage with UNM'),
    items: [
      {
        title: t('Programmes sur mesure', 'Custom Programs'),
        body: t(
          "Co-construisez avec nos équipes pédagogiques un dispositif intégralement conçu pour vos enjeux. Adapté à votre stratégie, à vos populations cibles et à vos contraintes opérationnelles.",
          'Co-design a fully tailored learning experience with our academic teams. Built around your strategy, your target populations and your operational constraints.',
        ),
      },
      {
        title: t('Cohortes dédiées', 'Dedicated Cohorts'),
        body: t(
          "Inscrivez une équipe complète dans l'un de nos MBA ou notre DBA Executive. Vos cadres apprennent ensemble, dans une dynamique collective qui ancre durablement les acquis dans votre organisation.",
          'Enroll an entire team in one of our Executive MBA programs or our DBA. Your leaders learn together — building a collective dynamic that embeds knowledge deep within your organization.',
        ),
      },
      {
        title: t('Académies institutionnelles', 'Institutional Academies'),
        body: t(
          "Déployez un programme de transformation à grande échelle, sur plusieurs niveaux hiérarchiques et plusieurs cohortes successives. Idéal pour les ministères, agences publiques et grands groupes qui souhaitent diffuser une culture managériale partagée.",
          'Deploy large-scale transformation across multiple hierarchical levels and successive cohorts. Designed for ministries, public agencies and corporate groups committed to a shared management culture.',
        ),
      },
    ],
  },

  custom: {
    title: t('Programmes sur mesure', 'Custom Programs'),
    paragraphs: [
      t(
        "Le secteur public africain, comme les grandes organisations privées du continent, font face à une complexité inédite : transformation digitale, modernisation des services, montée en compétence face à la pression des risques et nouvelles attentes citoyennes.",
        "Africa's public sector and large private organizations face unprecedented complexity: digital transformation, service modernization, rising risk pressure, evolving citizen and customer expectations.",
      ),
      t(
        "Nos programmes sur mesure répondent à ces défis. Chaque dispositif est co-conçu avec votre direction. Nous partons de vos enjeux stratégiques pour bâtir un parcours qui mobilise les meilleurs intervenants UNM et EBS, croise les expertises internationales et les cas africains, et délivre des résultats mesurables.",
        'Our custom programs respond directly to these challenges. Each engagement is co-designed with your leadership team. We start from your strategic priorities to build a learning journey that mobilizes top UNM and EBS faculty, blends international expertise with African case studies, and delivers measurable results.',
      ),
    ],
    subTitle: t('Ce qui distingue nos programmes sur mesure', 'What Sets Our Custom Programs Apart'),
    bullets: [
      { text: t('Co-construction directe avec votre comité exécutif', 'Direct co-design with your executive committee') },
      { text: t('Intervenants UNM et European Business School de réputation internationale', 'UNM and European Business School faculty of international standing') },
      { text: t('Cas pratiques ancrés dans votre secteur et votre géographie', 'Case studies grounded in your sector and your geography') },
      { text: t("Pédagogie active : étude de cas, simulations, projets appliqués à vos enjeux réels", 'Active pedagogy: case method, simulations, projects applied to your real challenges') },
      { text: t('Format hybride adapté à vos contraintes opérationnelles', 'Hybrid format adapted to your operational constraints') },
      { text: t("Mesure d'impact organisationnel à 6 et 12 mois", 'Organizational impact measurement at 6 and 12 months') },
    ],
    closing: t(
      "Nos programmes sur mesure s'adressent prioritairement aux organisations de plus de 200 collaborateurs et aux administrations publiques porteuses d'une stratégie de transformation explicite.",
      'Our custom programs primarily serve organizations of 200+ employees and public administrations with an explicit transformation strategy.',
    ),
  },

  cohorts: {
    title: t('Cohortes dédiées', 'Dedicated Cohorts'),
    paragraphs: [
      t(
        "Mobilisez une équipe entière dans l'un de nos 9 MBA Executive ou notre DBA. Une cohorte dédiée transforme l'apprentissage individuel en dynamique collective.",
        'Bring an entire team into one of our 9 Executive MBA programs or our DBA. A dedicated cohort turns individual learning into a collective dynamic.',
      ),
      t(
        "Quand vos cadres se forment ensemble, ils ne développent pas seulement des compétences personnelles. Ils construisent un langage managérial commun, alignent leurs visions stratégiques et renforcent leurs capacités de collaboration transverse — autant d'acquis qui restent dans l'organisation longtemps après la formation.",
        'When your leaders learn together, they build more than individual skills. They develop a shared management language, align strategic visions and strengthen cross-functional collaboration — gains that stay with the organization long after the program ends.',
      ),
    ],
    subTitle: t('Bénéfices pour votre organisation', 'Benefits for Your Organization'),
    bullets: [
      { text: t('Alignement stratégique des équipes dirigeantes', 'Strategic alignment across your leadership teams') },
      { text: t('Émulation collective autour des cas étudiés', 'Collective momentum around shared cases and frameworks') },
      { text: t('Application immédiate des apprentissages à vos projets en cours', 'Immediate application of learning to your current projects') },
      { text: t('Renforcement des liens entre directions et entre territoires', 'Stronger ties between departments and territories') },
      { text: t('Capitalisation durable des savoirs au sein de votre organisation', 'Lasting capitalization of knowledge within your organization') },
    ],
  },

  academies: {
    title: t('Académies institutionnelles', 'Institutional Academies'),
    paragraphs: [
      t(
        "Pour les ministères, agences publiques, collectivités territoriales et grands groupes, l'UNM conçoit des académies internes : des dispositifs de formation déployés à plusieurs niveaux hiérarchiques, sur plusieurs cohortes successives, pendant plusieurs années.",
        'For ministries, public agencies, territorial authorities and corporate groups, UNM designs internal academies: learning architectures deployed across multiple hierarchical levels, over successive cohorts, across several years.',
      ),
      t(
        "Une académie institutionnelle UNM permet de bâtir une culture managériale homogène à l'échelle d'un ministère, d'une région ou d'un groupe. Elle s'inscrit dans la durée et délivre une transformation profonde et mesurable.",
        'A UNM institutional academy builds a consistent management culture at the scale of a ministry, a region or a group. It works over time and delivers transformation that is both deep and measurable.',
      ),
    ],
    subTitle: t("Architecture type d'une académie", 'Typical Academy Architecture'),
    bullets: [
      { text: t('Diagnostic des besoins par niveau hiérarchique et par direction', 'Diagnostic of needs by hierarchical level and by department') },
      { text: t('Parcours différenciés : dirigeants, cadres supérieurs, encadrement intermédiaire', 'Differentiated tracks: senior leaders, executives, middle management') },
      { text: t('Modules transversaux garantissant la cohérence culturelle', 'Transversal modules that secure cultural consistency') },
      { text: t('Format hybride : digital principal, séminaires présentiels stratégiques', 'Hybrid format: digital core, strategic in-person seminars') },
      { text: t('Pilotage continu, indicateurs partagés, reporting d’impact', 'Continuous steering, shared KPIs, impact reporting') },
    ],
  },

  partners: {
    eyebrow: t('Partenaires institutionnels', 'Institutional partners'),
    title: t('Avec qui nous collaborons', 'Who We Partner With'),
    intro: t(
      "L'UNM travaille avec des organisations qui partagent une exigence : former des dirigeants capables de transformer leurs structures.",
      'UNM works with organizations that share one demand: developing leaders capable of transforming their institutions.',
    ),
    categories: [
      { title: t('Ministères et administrations publiques', 'Ministries and Public Administrations'), body: t('Modernisation, transformation digitale, montée en compétence des cadres dirigeants.', 'Modernization, digital transformation, leadership development across senior cadres.') },
      { title: t('Collectivités territoriales', 'Territorial Authorities'), body: t('Régions, préfectures, communes engagées dans une dynamique de développement local.', 'Regions, prefectures and cities engaged in local development.') },
      { title: t('Agences publiques et établissements', 'Public Agencies and Institutions'), body: t("Institutions à mission cherchant à renforcer leur gouvernance et leur performance.", 'Mission-driven entities seeking to strengthen governance and performance.') },
      { title: t('Grandes entreprises africaines', 'Large African Corporations'), body: t('Banques, assurances, télécommunications, mines, énergie, distribution, hospitalité.', 'Banking, insurance, telecoms, mining, energy, retail, hospitality.') },
      { title: t('Organisations internationales et bailleurs', 'International Organizations and Donors'), body: t('Opérateurs souhaitant renforcer les capacités locales sur le continent africain.', 'Operators seeking to strengthen local capacity across the African continent.') },
    ],
  },

  experience: {
    eyebrow: t('Expérience', 'Experience'),
    title: t("L'expérience UNM", 'The UNM Experience'),
    pillars: [
      {
        title: t('Une pédagogie 100 % numérique, pensée pour les dirigeants', 'Fully Digital Pedagogy, Built for Executives'),
        body: t(
          'Plateforme dédiée, classes virtuelles synchrones, ressources accessibles en permanence. Vos équipes se forment sans interrompre leur activité, depuis Casablanca, Dakar, Abidjan ou Libreville.',
          'Dedicated platform, synchronous virtual classrooms, resources available anytime. Your teams learn without interrupting their professional activity — from Casablanca, Dakar, Abidjan or Libreville.',
        ),
      },
      {
        title: t('Un savoir actionnable', 'Actionable Knowledge'),
        body: t(
          "Chaque module est conçu pour produire un résultat concret dans votre organisation. Nos intervenants partent des cas africains pour bâtir des compétences immédiatement applicables — c'est le sens même de notre devise : « Le savoir qui transforme l'action ».",
          'Every module is designed to produce a concrete outcome inside your organization. Our faculty starts from African cases to build skills that are immediately applicable. This is the essence of our promise: "Knowledge that transforms action."',
        ),
      },
      {
        title: t('Un adossement académique international', 'International Academic Backing'),
        body: t(
          "Notre partenariat avec European Business School (Paris · Barcelone · Berlin) garantit l'accès aux standards Executive internationaux. Sans jamais renoncer à l'ancrage africain qui fait la singularité de l'UNM.",
          'Our partnership with European Business School (Paris · Barcelona · Berlin) secures access to international Executive standards — without ever losing the African grounding that defines UNM.',
        ),
      },
      {
        title: t("Une mesure d'impact rigoureuse", 'Rigorous Impact Measurement'),
        body: t(
          "Évaluation des acquis, suivi des projets d'application, restitution organisationnelle à 6 et 12 mois. Nous engageons des résultats pour vos équipes — pas seulement des heures de formation.",
          'Learning assessment, application project follow-up, organizational debrief at 6 and 12 months. We commit to results for your teams — not just training hours.',
        ),
      },
    ],
  },

  closing: {
    title: t('Construisons votre dispositif', 'Let’s Design Your Engagement'),
    body: t(
      'Échangeons sur vos enjeux stratégiques. Nos conseillers institutionnels vous proposent un premier cadrage sous 48 heures.',
      'Let’s discuss your strategic priorities. Our institutional advisors will return a first scoping proposal within 48 hours.',
    ),
    ctas: {
      primary: { label: t('Prendre rendez-vous', 'Book a meeting'), href: '/contact?subject=organisations' },
      secondary: { label: t('Télécharger la brochure', 'Download the brochure'), href: '/contact?subject=brochure-organisations' },
    },
  },
};
