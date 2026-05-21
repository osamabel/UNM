import 'dotenv/config';
import path from 'path';
import payload from 'payload';
import crypto from 'crypto';

// ════════════════════════════════════════════════════════════════
// UNM seed — official taxonomy (validated by UNM management).
//
//   Faculties              Status            Programmes
//   ─────────────────────  ─────────────     ──────────────────
//   UNM Business School    Operational       DBA + 7 MBA
//   UNM School of Gov.     Operational       2 MBA
//   UNM School of Tech.    Coming soon       —
//   UNM School of Sport B. Coming soon       —
//
// Only operational faculties have programmes attached. Coming-soon
// faculties are rendered as non-clickable cards with a badge.
// ════════════════════════════════════════════════════════════════

interface FacultySeed {
  slug: string;
  displayOrder: number;
  color: string;
  icon: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  outcomes: { fr: string; en: string }[];
  strengths: { fr: string; en: string }[];
  domains?: { fr: string; en: string }[];
  comingSoon?: boolean;
}

const FACULTIES: FacultySeed[] = [
  // ── Operational ────────────────────────────────────────────────
  {
    slug: 'business-school',
    displayOrder: 1,
    color: '#B5341A',
    icon: 'business',
    name: { fr: 'UNM Business School', en: 'UNM Business School' },
    description: {
      fr: "L'UNM Business School constitue la première faculté déployée par l'Université Numérique du Maroc. Elle est développée en partenariat avec European Business School, école de management européenne présente à Paris, Barcelone et Berlin. Elle a pour vocation de former les dirigeants, les managers, les entrepreneurs et les décideurs publics africains, à travers des programmes Executive innovants, internationaux et contextualisés.",
      en: "UNM Business School is the first faculty deployed by the Digital University of Morocco. It is developed in partnership with European Business School, a European management school with campuses in Paris, Barcelona and Berlin. It is dedicated to training African executives, managers, entrepreneurs and public decision-makers, through innovative, international and contextualised Executive programmes.",
    },
    outcomes: [
      { fr: 'Directeur de business unit', en: 'Business Unit Director' },
      { fr: 'Chief Strategy Officer', en: 'Chief Strategy Officer' },
      { fr: 'Directeur financier', en: 'Chief Financial Officer' },
      { fr: 'Consultant senior', en: 'Senior Consultant' },
    ],
    strengths: [
      { fr: 'Excellence académique internationale', en: 'International academic excellence' },
      { fr: 'Approche orientée action et impact', en: 'Action and impact-oriented approach' },
      { fr: 'Flexibilité numérique', en: 'Digital flexibility' },
      { fr: 'Ancrage africain', en: 'African anchoring' },
      { fr: 'Intervenants internationaux', en: 'International faculty' },
      { fr: 'Études de cas africaines', en: 'African case studies' },
      { fr: 'Leadership transformationnel', en: 'Transformational leadership' },
    ],
    domains: [
      { fr: 'Management',               en: 'Management' },
      { fr: 'Finance',                  en: 'Finance' },
      { fr: 'Gouvernance',              en: 'Governance' },
      { fr: 'Marketing',                en: 'Marketing' },
      { fr: 'Intelligence économique',  en: 'Business intelligence' },
      { fr: 'Management public',        en: 'Public management' },
      { fr: 'Stratégie',                en: 'Strategy' },
      { fr: 'Transformation digitale',  en: 'Digital transformation' },
      { fr: 'Tourisme & Hospitality',   en: 'Tourism & Hospitality' },
      { fr: 'Ressources minières',      en: 'Mining resources' },
    ],
  },
  {
    slug: 'school-of-governance',
    displayOrder: 2,
    color: '#3D1A0B',
    icon: 'governance',
    comingSoon: true,
    name: { fr: 'UNM School of Governance & Public Affairs', en: 'UNM School of Governance & Public Affairs' },
    description: {
      fr: "Future faculté dédiée aux politiques publiques, à la gouvernance et aux finances publiques. Elle préparera les cadres et dirigeants des administrations, agences et organisations publiques à conduire les transformations institutionnelles du continent.",
      en: 'Upcoming faculty dedicated to public policy, governance and public finance. It will prepare executives and leaders of administrations, agencies and public organisations to drive institutional transformations across the continent.',
    },
    outcomes: [
      { fr: 'Secrétaire général de ministère', en: 'Ministry Secretary General' },
      { fr: 'Directeur fiscal', en: 'Tax Director' },
      { fr: "Directeur général d'établissement public", en: 'CEO of a public agency' },
      { fr: 'Conseiller stratégique gouvernemental', en: 'Government strategic advisor' },
    ],
    strengths: [
      { fr: 'Expertise des politiques publiques africaines', en: 'Expertise in African public policy' },
      { fr: 'Programmes co-construits avec EBS Paris', en: 'Programmes co-built with EBS Paris' },
      { fr: 'Cas réels d’administrations publiques', en: 'Real-world public administration cases' },
    ],
    domains: [
      { fr: 'Politiques publiques',    en: 'Public policy' },
      { fr: 'Finances publiques',      en: 'Public finance' },
      { fr: 'Fiscalité',               en: 'Taxation' },
      { fr: 'Management public',       en: 'Public management' },
      { fr: 'Gouvernance institutionnelle', en: 'Institutional governance' },
    ],
  },

  // ── Coming soon ────────────────────────────────────────────────
  {
    slug: 'school-of-technology',
    displayOrder: 3,
    color: '#8B2712',
    icon: 'technology',
    comingSoon: true,
    name: { fr: 'UNM School of Technology', en: 'UNM School of Technology' },
    description: {
      fr: "Future faculté dédiée à l'ingénierie logicielle, à la data, à l'intelligence artificielle et à la transformation digitale des organisations africaines.",
      en: "Upcoming faculty dedicated to software engineering, data, artificial intelligence and the digital transformation of African organisations. ",
    },
    outcomes: [],
    strengths: [],
  },
  {
    slug: 'school-of-sport-business',
    displayOrder: 4,
    color: '#CE4B2A',
    icon: 'sport',
    comingSoon: true,
    name: { fr: 'UNM School of Sport Business', en: 'UNM School of Sport Business' },
    description: {
      fr: "Future faculté consacrée au management du sport, à l'économie sportive et aux grandes infrastructures sportives en Afrique.",
      en: 'Upcoming faculty dedicated to sport management, sport economy and major sport infrastructure in Africa. ',
    },
    outcomes: [],
    strengths: [],
  },
];

// ─────────────────────────────────────────────────────────────────
// Programmes — same 10 programmes as before, redistributed across
// the two operational faculties.
//   • 8 under UNM Business School  (DBA + 7 MBA)
//   • 2 under School of Governance (MBA Fiscalité, MBA Gouv. & Mgt Public)
// ─────────────────────────────────────────────────────────────────

// Aligned with the official brochures (10 DOCX in UNM-Contenu/Programmes).
// Each programme exposes both narrative paragraphs (vocation, public-cible,
// debouches, skills) and a structured curriculum used by the new editorial
// programme template.
interface ProgramSeed {
  slug: string;
  faculty: string;
  type: 'DBA' | 'MBA' | 'Bachelor' | 'Certificate';
  title: { fr: string; en: string };
  shortPitch: { fr: string; en: string };
  vocation: { fr: string; en: string };
  targetAudience: { fr: string; en: string };
  careerOutlooks: { fr: string; en: string };
  skillsNarrative: { fr: string; en: string };
  objectives: { fr: string; en: string }[];
  duration: string;
  format: 'Présentiel' | 'Distanciel' | 'Hybride';
  bacLevel: string;
  schedule: { fr: string; en: string };
  admission: { fr: string; en: string };
  tuitionFee?: number | null;
  isFeatured: boolean;
  curriculum: {
    code: string;
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    group?: { fr: string; en: string };
  }[];
}

const PROGRAMS: ProgramSeed[] = [
  {
    slug: 'dba-business-administration',
    faculty: 'business-school',
    type: 'DBA',
    title: { fr: 'Doctorate in Business Administration (DBA)', en: 'Doctorate in Business Administration (DBA)' },
    shortPitch: { fr: 'Accédez au titre de Docteur (Dr.) en Administration des affaires délivré par European Business School en partenariat avec l\'Université Numérique du Maroc.', en: 'Accédez au titre de Docteur (Dr.) en Administration des affaires délivré par European Business School en partenariat avec l\'Université Numérique du Maroc.' },  // EN translation TBD
    vocation: { fr: 'Accédez au titre de Docteur (Dr.) en Administration des affaires délivré par European Business School en partenariat avec l\'Université Numérique du Maroc', en: 'Accédez au titre de Docteur (Dr.) en Administration des affaires délivré par European Business School en partenariat avec l\'Université Numérique du Maroc' },
    targetAudience: { fr: '', en: '' },
    careerOutlooks: { fr: '', en: '' },
    skillsNarrative: { fr: '', en: '' },
    objectives: [
      { fr: 'Former des leaders capables de produire une recherche appliquée à fort impact, en mobilisant des cadres théoriques rigoureux.', en: 'Former des leaders capables de produire une recherche appliquée à fort impact, en mobilisant des cadres théoriques rigoureux.' },
      { fr: 'Développer une pensée stratégique et une capacité de transformation, permettant aux dirigeants de piloter le changement et d\'innover.', en: 'Développer une pensée stratégique et une capacité de transformation, permettant aux dirigeants de piloter le changement et d\'innover.' },
    ],
    duration: '2 ans',
    format: 'Hybride',
    bacLevel: 'Bac + 5',
    schedule: { fr: 'Format hybride en ligne — séminaires synchrones et accompagnement individualisé.', en: 'Hybrid online format — synchronous seminars with one-to-one mentoring.' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: true,
    curriculum: [
      {
        code: 'S1',
        title: { fr: 'Fondamentaux d\'un DBA', en: 'Fondamentaux d\'un DBA' },
        description: { fr: '', en: '' },
        group: { fr: 'Première année', en: 'Year 1' },
      },
      {
        code: 'S2',
        title: { fr: 'Revue de littérature & Design de la Recherche', en: 'Revue de littérature & Design de la Recherche' },
        description: { fr: '', en: '' },
        group: { fr: 'Première année', en: 'Year 1' },
      },
      {
        code: 'S3',
        title: { fr: 'IA et Stratégie de Recherche Documentaire', en: 'IA et Stratégie de Recherche Documentaire' },
        description: { fr: '', en: '' },
        group: { fr: 'Première année', en: 'Year 1' },
      },
      {
        code: 'S4',
        title: { fr: 'Méthodologies Qualitatives', en: 'Méthodologies Qualitatives' },
        description: { fr: '', en: '' },
        group: { fr: 'Première année', en: 'Year 1' },
      },
      {
        code: 'S5',
        title: { fr: 'Méthodologies Quantitatives', en: 'Méthodologies Quantitatives' },
        description: { fr: '', en: '' },
        group: { fr: 'Deuxième année', en: 'Year 2' },
      },
      {
        code: 'S6',
        title: { fr: 'Analyse Qualitative Approfondie', en: 'Analyse Qualitative Approfondie' },
        description: { fr: '', en: '' },
        group: { fr: 'Deuxième année', en: 'Year 2' },
      },
      {
        code: 'S7',
        title: { fr: 'Analyse avancée et Production de Résultats à impact managérial', en: 'Analyse avancée et Production de Résultats à impact managérial' },
        description: { fr: '', en: '' },
        group: { fr: 'Deuxième année', en: 'Year 2' },
      },
      {
        code: 'S8',
        title: { fr: 'Rédaction finale, valorisation et soutenance', en: 'Rédaction finale, valorisation et soutenance' },
        description: { fr: '', en: '' },
        group: { fr: 'Deuxième année', en: 'Year 2' },
      },
    ],
  },
  {
    slug: 'mba-banques-assurances',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Banques & Assurances', en: 'MBA Banking & Insurance' },
    shortPitch: { fr: 'Ce MBA vise à former des profils capables de comprendre, piloter et transformer les organisations financières dans un environnement en mutation accélérée.', en: 'Ce MBA vise à former des profils capables de comprendre, piloter et transformer les organisations financières dans un environnement en mutation accélérée.' },  // EN translation TBD
    vocation: { fr: 'Ce MBA vise à former des profils capables de comprendre, piloter et transformer les organisations financières dans un environnement en mutation accélérée. Au-delà de la maîtrise technique des produits bancaires et assurantiels, le programme met l\'accent sur la capacité à adopter une vision globale des écosystèmes financiers, à intégrer les enjeux de digitalisation, de régulation et de gestion des risques.', en: 'Ce MBA vise à former des profils capables de comprendre, piloter et transformer les organisations financières dans un environnement en mutation accélérée. Au-delà de la maîtrise technique des produits bancaires et assurantiels, le programme met l\'accent sur la capacité à adopter une vision globale des écosystèmes financiers, à intégrer les enjeux de digitalisation, de régulation et de gestion des risques.' },
    targetAudience: { fr: 'Ce MBA s\'adresse à un public souhaitant évoluer ou se spécialiser dans les métiers de la banque, de l\'assurance et, plus largement, des services financiers. Il est particulièrement adapté aux professionnels en activité au sein des banques, compagnies d\'assurance ou institutions financières désireux de renforcer leurs compétences ou d\'accéder à des fonctions de management, ainsi qu\'aux cadres en reconversion visant une spécialisation dans le secteur financier.', en: 'Ce MBA s\'adresse à un public souhaitant évoluer ou se spécialiser dans les métiers de la banque, de l\'assurance et, plus largement, des services financiers. Il est particulièrement adapté aux professionnels en activité au sein des banques, compagnies d\'assurance ou institutions financières désireux de renforcer leurs compétences ou d\'accéder à des fonctions de management, ainsi qu\'aux cadres en reconversion visant une spécialisation dans le secteur financier.' },
    careerOutlooks: { fr: 'Ce MBA ouvre l\'accès à des fonctions à forte responsabilité dans les secteurs bancaire, assurantiel et financier, notamment des postes de directeur d\'agence bancaire ou de responsable de business unit. Il permet également d\'évoluer vers des fonctions de responsable des risques, de la conformité ou de l\'audit interne, ainsi que vers des rôles de manager en bancassurance ou en développement commercial.', en: 'Ce MBA ouvre l\'accès à des fonctions à forte responsabilité dans les secteurs bancaire, assurantiel et financier, notamment des postes de directeur d\'agence bancaire ou de responsable de business unit. Il permet également d\'évoluer vers des fonctions de responsable des risques, de la conformité ou de l\'audit interne, ainsi que vers des rôles de manager en bancassurance ou en développement commercial.' },
    skillsNarrative: { fr: 'À l\'issue du MBA, les participants seront en mesure de décrypter les dynamiques du secteur bancaire et assurantiel, tant à l\'échelle nationale qu\'internationale, et de piloter des activités financières en intégrant les contraintes réglementaires et les exigences de performance. Ils développeront des compétences en conception de stratégies orientées client dans des environnements omnicanaux, tout en maîtrisant les outils d\'analyse des risques et d\'aide à la décision.', en: 'À l\'issue du MBA, les participants seront en mesure de décrypter les dynamiques du secteur bancaire et assurantiel, tant à l\'échelle nationale qu\'internationale, et de piloter des activités financières en intégrant les contraintes réglementaires et les exigences de performance. Ils développeront des compétences en conception de stratégies orientées client dans des environnements omnicanaux, tout en maîtrisant les outils d\'analyse des risques et d\'aide à la décision.' },
    objectives: [
      { fr: 'Comprendre les dynamiques des écosystèmes bancaires et assurantiels dans un contexte de transformation.', en: 'Comprendre les dynamiques des écosystèmes bancaires et assurantiels dans un contexte de transformation.' },
      { fr: 'Piloter la performance financière en intégrant les enjeux de rentabilité, de conformité et de gestion des risques.', en: 'Piloter la performance financière en intégrant les enjeux de rentabilité, de conformité et de gestion des risques.' },
      { fr: 'Accompagner les transformations digitales des institutions financières et l\'innovation dans les services financiers.', en: 'Accompagner les transformations digitales des institutions financières et l\'innovation dans les services financiers.' },
      { fr: 'Maîtriser les cadres réglementaires et les exigences de gouvernance propres au secteur bancaire et assurantiel.', en: 'Maîtriser les cadres réglementaires et les exigences de gouvernance propres au secteur bancaire et assurantiel.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: true,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Comprendre les dynamiques du système financier global', en: 'Comprendre les dynamiques du système financier global' },
        description: { fr: 'Ce séminaire introduit les grandes logiques de fonctionnement des systèmes bancaires et financiers, en mettant l\'accent sur leur rôle économique.', en: 'Ce séminaire introduit les grandes logiques de fonctionnement des systèmes bancaires et financiers, en mettant l\'accent sur leur rôle économique.' },
      },
      {
        code: 'M2',
        title: { fr: 'Concevoir des offres bancaires centrées client', en: 'Concevoir des offres bancaires centrées client' },
        description: { fr: 'Ce module explore la conception et la structuration des produits et services bancaires dans une logique orientée client.', en: 'Ce module explore la conception et la structuration des produits et services bancaires dans une logique orientée client.' },
      },
      {
        code: 'M3',
        title: { fr: 'Décision de crédit et évaluation des risques clients', en: 'Décision de crédit et évaluation des risques clients' },
        description: { fr: 'Ce séminaire développe les outils d\'analyse permettant d\'évaluer la solvabilité des emprunteurs et de sécuriser les engagements financiers.', en: 'Ce séminaire développe les outils d\'analyse permettant d\'évaluer la solvabilité des emprunteurs et de sécuriser les engagements financiers.' },
      },
      {
        code: 'M4',
        title: { fr: 'Stratégies d\'investissement et marchés financiers', en: 'Stratégies d\'investissement et marchés financiers' },
        description: { fr: 'Ce module permet de comprendre le fonctionnement des marchés financiers et les logiques d\'investissement. Il introduit les principaux instruments financiers.', en: 'Ce module permet de comprendre le fonctionnement des marchés financiers et les logiques d\'investissement. Il introduit les principaux instruments financiers.' },
      },
      {
        code: 'M5',
        title: { fr: 'Assurance et bancassurance : vers des modèles intégrés', en: 'Assurance et bancassurance : vers des modèles intégrés' },
        description: { fr: 'Ce séminaire analyse les mécanismes de l\'assurance et leur articulation avec les activités bancaires. Il met en avant les modèles de bancassurance.', en: 'Ce séminaire analyse les mécanismes de l\'assurance et leur articulation avec les activités bancaires. Il met en avant les modèles de bancassurance.' },
      },
      {
        code: 'M6',
        title: { fr: 'Pilotage actuariel et rentabilité des produits assurantiels', en: 'Pilotage actuariel et rentabilité des produits assurantiels' },
        description: { fr: 'Ce module introduit les fondements de l\'actuariat appliqué à l\'assurance, en mettant l\'accent sur la tarification, la modélisation des risques et l\'équilibre technique.', en: 'Ce module introduit les fondements de l\'actuariat appliqué à l\'assurance, en mettant l\'accent sur la tarification, la modélisation des risques et l\'équilibre technique.' },
      },
      {
        code: 'M7',
        title: { fr: 'Gouvernance, conformité et régulation financière', en: 'Gouvernance, conformité et régulation financière' },
        description: { fr: 'Ce séminaire traite des cadres réglementaires encadrant les activités bancaires et assurantielles. Il aborde les enjeux de conformité et de gouvernance.', en: 'Ce séminaire traite des cadres réglementaires encadrant les activités bancaires et assurantielles. Il aborde les enjeux de conformité et de gouvernance.' },
      },
      {
        code: 'M8',
        title: { fr: 'Management global des risques financiers', en: 'Management global des risques financiers' },
        description: { fr: 'Ce module propose une approche intégrée de la gestion des risques. Il permet de développer des dispositifs d\'anticipation et de pilotage.', en: 'Ce module propose une approche intégrée de la gestion des risques. Il permet de développer des dispositifs d\'anticipation et de pilotage.' },
      },
      {
        code: 'M9',
        title: { fr: 'Marketing des services financiers et expérience client', en: 'Marketing des services financiers et expérience client' },
        description: { fr: 'Ce séminaire met l\'accent sur les stratégies marketing dans le secteur financier, en intégrant les dimensions comportementales et digitales.', en: 'Ce séminaire met l\'accent sur les stratégies marketing dans le secteur financier, en intégrant les dimensions comportementales et digitales.' },
      },
      {
        code: 'M10',
        title: { fr: 'Transformation digitale, fintech et innovation financière', en: 'Transformation digitale, fintech et innovation financière' },
        description: { fr: 'Ce module explore les transformations induites par les technologies dans les secteurs bancaire et assurantiel. Il aborde les fintechs, l\'IA et la blockchain.', en: 'Ce module explore les transformations induites par les technologies dans les secteurs bancaire et assurantiel. Il aborde les fintechs, l\'IA et la blockchain.' },
      },
      {
        code: 'M11',
        title: { fr: 'Finance inclusive et nouveaux modèles de financement', en: 'Finance inclusive et nouveaux modèles de financement' },
        description: { fr: 'Ce séminaire traite des enjeux d\'inclusion financière et des dispositifs innovants permettant d\'élargir l\'accès aux services financiers.', en: 'Ce séminaire traite des enjeux d\'inclusion financière et des dispositifs innovants permettant d\'élargir l\'accès aux services financiers.' },
      },
      {
        code: 'M12',
        title: { fr: 'Méthodologie de recherche et mémoire professionnel', en: 'Méthodologie de recherche et mémoire professionnel' },
        description: { fr: 'Ce séminaire accompagne les participants dans la structuration de leur mémoire professionnel. Il permet de développer une démarche analytique rigoureuse.', en: 'Ce séminaire accompagne les participants dans la structuration de leur mémoire professionnel. Il permet de développer une démarche analytique rigoureuse.' },
      },
    ],
  },
  {
    slug: 'mba-comptabilite-controle-audit',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Comptabilité Contrôle & Audit', en: 'MBA Accounting, Controlling & Audit' },
    shortPitch: { fr: 'Ce MBA vise à former des professionnels capables de maîtriser les enjeux comptables, financiers et d\'audit dans une perspective stratégique et décisionnelle.', en: 'Ce MBA vise à former des professionnels capables de maîtriser les enjeux comptables, financiers et d\'audit dans une perspective stratégique et décisionnelle.' },  // EN translation TBD
    vocation: { fr: 'Ce MBA vise à former des professionnels capables de maîtriser les enjeux comptables, financiers et d\'audit dans une perspective stratégique et décisionnelle. Il permet aux participants de développer une compréhension approfondie des mécanismes de production et d\'analyse de l\'information financière, ainsi que des outils de contrôle et de gouvernance.', en: 'Ce MBA vise à former des professionnels capables de maîtriser les enjeux comptables, financiers et d\'audit dans une perspective stratégique et décisionnelle. Il permet aux participants de développer une compréhension approfondie des mécanismes de production et d\'analyse de l\'information financière, ainsi que des outils de contrôle et de gouvernance.' },
    targetAudience: { fr: 'Ce programme s\'adresse à des profils souhaitant évoluer vers des fonctions à forte responsabilité financière, notamment les professionnels de la comptabilité, de l\'audit et de la finance, ainsi que les cadres et responsables financiers tels que les directeurs administratifs et financiers, contrôleurs de gestion ou chefs comptables. Il concerne également les auditeurs internes et externes et les consultants en finance et en conseil, ainsi que les jeunes diplômés en Finances.', en: 'Ce programme s\'adresse à des profils souhaitant évoluer vers des fonctions à forte responsabilité financière, notamment les professionnels de la comptabilité, de l\'audit et de la finance, ainsi que les cadres et responsables financiers tels que les directeurs administratifs et financiers, contrôleurs de gestion ou chefs comptables. Il concerne également les auditeurs internes et externes et les consultants en finance et en conseil, ainsi que les jeunes diplômés en Finances.' },
    careerOutlooks: { fr: 'À l\'issue du MBA, les participants pourront accéder à des fonctions à forte responsabilité dans les domaines de la comptabilité, de la finance et de l\'audit. Ils pourront évoluer vers des postes tels que Directeur Administratif et Financier, auditeur interne ou externe, ou encore consultant en audit, contrôle et performance financière. Le programme ouvre également des perspectives vers des fonctions d\'expertise en normes comptables et audit international.', en: 'À l\'issue du MBA, les participants pourront accéder à des fonctions à forte responsabilité dans les domaines de la comptabilité, de la finance et de l\'audit. Ils pourront évoluer vers des postes tels que Directeur Administratif et Financier, auditeur interne ou externe, ou encore consultant en audit, contrôle et performance financière. Le programme ouvre également des perspectives vers des fonctions d\'expertise en normes comptables et audit international.' },
    skillsNarrative: { fr: 'Le programme permet de développer des compétences à forte valeur ajoutée dans les domaines de la comptabilité, de la finance et de l\'audit, notamment en matière d\'analyse et d\'interprétation des états financiers, de maîtrise des normes comptables nationales et internationales (IFRS), et de conception de dispositifs de contrôle interne. Les participants acquièrent également des compétences en audit financier et opérationnel, en évaluation des risques et en pilotage de la performance.', en: 'Le programme permet de développer des compétences à forte valeur ajoutée dans les domaines de la comptabilité, de la finance et de l\'audit, notamment en matière d\'analyse et d\'interprétation des états financiers, de maîtrise des normes comptables nationales et internationales (IFRS), et de conception de dispositifs de contrôle interne. Les participants acquièrent également des compétences en audit financier et opérationnel, en évaluation des risques et en pilotage de la performance.' },
    objectives: [
      { fr: 'Maîtriser les normes comptables et d\'audit dans un environnement national et international.', en: 'Maîtriser les normes comptables et d\'audit dans un environnement national et international.' },
      { fr: 'Renforcer leur capacité à contribuer à la fiabilité et à la transparence de l\'information financière.', en: 'Renforcer leur capacité à contribuer à la fiabilité et à la transparence de l\'information financière.' },
      { fr: 'Conduire des missions d\'audit et d\'évaluation dans des contextes complexes.', en: 'Conduire des missions d\'audit et d\'évaluation dans des contextes complexes.' },
      { fr: 'Analyser la performance financière et accompagner la prise de décision stratégique.', en: 'Analyser la performance financière et accompagner la prise de décision stratégique.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: false,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Fondamentaux de la Comptabilité Générale', en: 'Fondamentaux de la Comptabilité Générale' },
        description: { fr: 'Ce module introduit les bases de la comptabilité, permettant aux apprenants de comprendre les principes de gestion financière et de préparation des états.', en: 'Ce module introduit les bases de la comptabilité, permettant aux apprenants de comprendre les principes de gestion financière et de préparation des états.' },
      },
      {
        code: 'M2',
        title: { fr: 'Comptabilité Approfondie', en: 'Comptabilité Approfondie' },
        description: { fr: 'Ce module approfondit les techniques comptables pour gérer des situations complexes, y compris la consolidation des comptes pour les groupes d\'entreprises.', en: 'Ce module approfondit les techniques comptables pour gérer des situations complexes, y compris la consolidation des comptes pour les groupes d\'entreprises.' },
      },
      {
        code: 'M3',
        title: { fr: 'Audit Financier & Comptable', en: 'Audit Financier & Comptable' },
        description: { fr: 'Ce module forme les participants aux étapes du processus d\'audit financier, de la planification à la présentation des résultats.', en: 'Ce module forme les participants aux étapes du processus d\'audit financier, de la planification à la présentation des résultats.' },
      },
      {
        code: 'M4',
        title: { fr: 'Comptabilité de Gestion et Contrôle Budgétaire', en: 'Comptabilité de Gestion et Contrôle Budgétaire' },
        description: { fr: 'Ce module explore les outils et techniques de contrôle budgétaire et de comptabilité de gestion pour améliorer les performances des organisations.', en: 'Ce module explore les outils et techniques de contrôle budgétaire et de comptabilité de gestion pour améliorer les performances des organisations.' },
      },
      {
        code: 'M5',
        title: { fr: 'Normes Internationales d\'Audit', en: 'Normes Internationales d\'Audit' },
        description: { fr: 'Ce module initie les participants aux normes internationales d\'audit pour garantir une conformité et une qualité irréprochables dans les missions d\'audit.', en: 'Ce module initie les participants aux normes internationales d\'audit pour garantir une conformité et une qualité irréprochables dans les missions d\'audit.' },
      },
      {
        code: 'M6',
        title: { fr: 'Fiscalité des Entreprises', en: 'Fiscalité des Entreprises' },
        description: { fr: 'Ce module permet de comprendre les règles fiscales applicables aux entreprises et de maîtriser leur impact sur les décisions financières.', en: 'Ce module permet de comprendre les règles fiscales applicables aux entreprises et de maîtriser leur impact sur les décisions financières.' },
      },
      {
        code: 'M7',
        title: { fr: 'Innovation et Transformation Digitale', en: 'Innovation et Transformation Digitale' },
        description: { fr: 'Ce module présente les leviers numériques pour moderniser l\'administration publique. Il favorise l\'usage de solutions digitales pour plus d\'efficience et d\'accessibilité.', en: 'Ce module présente les leviers numériques pour moderniser l\'administration publique. Il favorise l\'usage de solutions digitales pour plus d\'efficience et d\'accessibilité.' },
      },
      {
        code: 'M8',
        title: { fr: 'Planification Stratégique et Gestion de Projet', en: 'Planification Stratégique et Gestion de Projet' },
        description: { fr: 'Ce module enseigne les méthodes de planification et de pilotage stratégique. Il permet de structurer et de suivre les projets publics avec des outils performants.', en: 'Ce module enseigne les méthodes de planification et de pilotage stratégique. Il permet de structurer et de suivre les projets publics avec des outils performants.' },
      },
      {
        code: 'M9',
        title: { fr: 'Éthique, Transparence et Lutte contre la Corruption', en: 'Éthique, Transparence et Lutte contre la Corruption' },
        description: { fr: 'Ce module renforce les capacités à promouvoir l\'intégrité et l\'éthique dans la gestion publique. Il présente les mécanismes de prévention et les outils de contrôle.', en: 'Ce module renforce les capacités à promouvoir l\'intégrité et l\'éthique dans la gestion publique. Il présente les mécanismes de prévention et les outils de contrôle.' },
      },
      {
        code: 'M10',
        title: { fr: 'Partenariats Public-Privé et Financements Innovants', en: 'Partenariats Public-Privé et Financements Innovants' },
        description: { fr: 'Ce module examine les montages de coopération entre secteur public et privé. Il présente les outils de financement innovants pour les projets publics.', en: 'Ce module examine les montages de coopération entre secteur public et privé. Il présente les outils de financement innovants pour les projets publics.' },
      },
      {
        code: 'M11',
        title: { fr: 'Évaluation des Politiques Publiques', en: 'Évaluation des Politiques Publiques' },
        description: { fr: 'Ce module forme à la conception de dispositifs d\'évaluation rigoureux. Il permet d\'identifier les effets réels des politiques mises en œuvre.', en: 'Ce module forme à la conception de dispositifs d\'évaluation rigoureux. Il permet d\'identifier les effets réels des politiques mises en œuvre.' },
      },
      {
        code: 'M12',
        title: { fr: 'Méthodologie de Recherche et Mémoire Professionnel', en: 'Méthodologie de Recherche et Mémoire Professionnel' },
        description: { fr: 'Ce module accompagne les participants dans l\'élaboration d\'un mémoire appliqué à un enjeu de gouvernance ou de gestion publique.', en: 'Ce module accompagne les participants dans l\'élaboration d\'un mémoire appliqué à un enjeu de gouvernance ou de gestion publique.' },
      },
    ],
  },
  {
    slug: 'mba-fiscalite-finances-publiques',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Fiscalité & Finances Publiques', en: 'MBA Tax & Public Finance' },
    shortPitch: { fr: 'Ce MBA vise à former des professionnels capables de comprendre, piloter et transformer les systèmes fiscaux et financiers dans un environnement public en mutation.', en: 'Ce MBA vise à former des professionnels capables de comprendre, piloter et transformer les systèmes fiscaux et financiers dans un environnement public en mutation.' },  // EN translation TBD
    vocation: { fr: 'Ce MBA vise à former des professionnels capables de comprendre, piloter et transformer les systèmes fiscaux et financiers dans un environnement public en mutation. Il a pour ambition de doter les participants d\'une vision globale et stratégique des politiques fiscales et des mécanismes de gestion des finances publiques.', en: 'Ce MBA vise à former des professionnels capables de comprendre, piloter et transformer les systèmes fiscaux et financiers dans un environnement public en mutation. Il a pour ambition de doter les participants d\'une vision globale et stratégique des politiques fiscales et des mécanismes de gestion des finances publiques.' },
    targetAudience: { fr: 'Ce programme s\'adresse à des profils à fort potentiel souhaitant évoluer vers des fonctions à responsabilité, notamment les cadres du secteur public et parapublic et les professionnels des finances, de la fiscalité et du contrôle de gestion. Il concerne également les consultants et experts en politiques publiques, ainsi que les responsables engagés dans des projets de réforme ou de transformation institutionnelle.', en: 'Ce programme s\'adresse à des profils à fort potentiel souhaitant évoluer vers des fonctions à responsabilité, notamment les cadres du secteur public et parapublic et les professionnels des finances, de la fiscalité et du contrôle de gestion. Il concerne également les consultants et experts en politiques publiques, ainsi que les responsables engagés dans des projets de réforme ou de transformation institutionnelle.' },
    careerOutlooks: { fr: 'À l\'issue du MBA, les participants pourront accéder à des fonctions à forte responsabilité, telles que directeur ou responsable des finances publiques, ou encore consultant en stratégie et transformation du secteur public. Ils pourront également évoluer comme experts en fiscalité et politiques publiques, responsables de la planification et du pilotage budgétaire, ou chargés d\'études économiques et financières.', en: 'À l\'issue du MBA, les participants pourront accéder à des fonctions à forte responsabilité, telles que directeur ou responsable des finances publiques, ou encore consultant en stratégie et transformation du secteur public. Ils pourront également évoluer comme experts en fiscalité et politiques publiques, responsables de la planification et du pilotage budgétaire, ou chargés d\'études économiques et financières.' },
    skillsNarrative: { fr: 'Le programme permet de développer un socle de compétences techniques, analytiques et stratégiques, notamment en analyse des systèmes fiscaux et financiers et en pilotage de la performance financière publique. Il renforce également la maîtrise des outils de gestion budgétaire, de contrôle et d\'évaluation des politiques publiques, ainsi que la gestion des risques fiscaux et réglementaires.', en: 'Le programme permet de développer un socle de compétences techniques, analytiques et stratégiques, notamment en analyse des systèmes fiscaux et financiers et en pilotage de la performance financière publique. Il renforce également la maîtrise des outils de gestion budgétaire, de contrôle et d\'évaluation des politiques publiques, ainsi que la gestion des risques fiscaux et réglementaires.' },
    objectives: [
      { fr: 'Développer une vision stratégique des finances publiques et de leur rôle dans le développement économique.', en: 'Développer une vision stratégique des finances publiques et de leur rôle dans le développement économique.' },
      { fr: 'Maîtriser les mécanismes fiscaux et budgétaires dans une logique de prise de décision.', en: 'Maîtriser les mécanismes fiscaux et budgétaires dans une logique de prise de décision.' },
      { fr: 'Analyser et évaluer les politiques publiques sous un angle économique, financier et institutionnel.', en: 'Analyser et évaluer les politiques publiques sous un angle économique, financier et institutionnel.' },
      { fr: 'Renforcer leur capacité à intervenir comme acteurs du changement au sein des organisations.', en: 'Renforcer leur capacité à intervenir comme acteurs du changement au sein des organisations.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: false,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Les préalables à la gestion fiscale Comprendre la gestion comptable et financière avec une étude approfondie du référentiel comptable, la comptabilité avancée, et l\'interprétation des états financiers.', en: 'Les préalables à la gestion fiscale Comprendre la gestion comptable et financière avec une étude approfondie du référentiel comptable, la comptabilité avancée, et l\'interprétation des états financiers.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M2',
        title: { fr: 'Gestion fiscale Comprendre les mécanismes de la fiscalité des personnes physiques et morales, la fiscalité sectorielle, la fiscalité indirecte notamment la TVA, la fiscalité locale incluant la taxe professionnelle et la taxe communale.', en: 'Gestion fiscale Comprendre les mécanismes de la fiscalité des personnes physiques et morales, la fiscalité sectorielle, la fiscalité indirecte notamment la TVA, la fiscalité locale incluant la taxe professionnelle et la taxe communale.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M3',
        title: { fr: 'Environnement juridique et légal Appréhender le droit de contrôle de l\'administration fiscale, les garanties des droits des contribuables, les procédures contradictoires des rectifications des bases imposables et les procédures de taxation.', en: 'Environnement juridique et légal Appréhender le droit de contrôle de l\'administration fiscale, les garanties des droits des contribuables, les procédures contradictoires des rectifications des bases imposables et les procédures de taxation.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M4',
        title: { fr: 'Fiscalité des restructurations Analyser et gérer efficacement des opérations fiscales particulières comme les créations et transformations d\'entreprises, de privatisation, les fusions, la scission d\'entreprises, ainsi que les liquidations.', en: 'Fiscalité des restructurations Analyser et gérer efficacement des opérations fiscales particulières comme les créations et transformations d\'entreprises, de privatisation, les fusions, la scission d\'entreprises, ainsi que les liquidations.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M5',
        title: { fr: 'Fiscalité internationale Savoir analyser les conventions fiscales et comprendre la fiscalisation des redevances, intérêts et dividendes et comprendre la méthode d\'élimination de la double imposition.', en: 'Fiscalité internationale Savoir analyser les conventions fiscales et comprendre la fiscalisation des redevances, intérêts et dividendes et comprendre la méthode d\'élimination de la double imposition.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M6',
        title: { fr: 'Optimisation de gestion fiscale Connaître les différentes techniques et stratégies permettant de minimiser légalement l\'impact fiscal pour les individus, les entreprises et autres organisations.', en: 'Optimisation de gestion fiscale Connaître les différentes techniques et stratégies permettant de minimiser légalement l\'impact fiscal pour les individus, les entreprises et autres organisations.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M7',
        title: { fr: 'FP & politique budgétaire Comprendre les concepts de base, les objectifs et principes des finances publiques ; le processus, les méthodes d\'élaboration, d\'exécution du budget dans les administrations publiques.', en: 'FP & politique budgétaire Comprendre les concepts de base, les objectifs et principes des finances publiques ; le processus, les méthodes d\'élaboration, d\'exécution du budget dans les administrations publiques.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M8',
        title: { fr: 'Comptabilité & marchés publics Savoir les règles de la comptabilité publique en matière d\'exécution de la dépense publique, la responsabilité des ordonnateurs et comptables publics, les principes et procédures de passation des marchés.', en: 'Comptabilité & marchés publics Savoir les règles de la comptabilité publique en matière d\'exécution de la dépense publique, la responsabilité des ordonnateurs et comptables publics, les principes et procédures de passation des marchés.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M9',
        title: { fr: 'Contrôle des finances publiques Appréhender les méthodes d\'évaluation des politiques publiques et leurs impacts économiques et sociaux, tout en saisissant les techniques d\'analyse de l\'efficacité des dépenses publiques.', en: 'Contrôle des finances publiques Appréhender les méthodes d\'évaluation des politiques publiques et leurs impacts économiques et sociaux, tout en saisissant les techniques d\'analyse de l\'efficacité des dépenses publiques.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M10',
        title: { fr: 'Financement international Comprendre la gestion de la dette publique, ses instruments, sa politique et surveillance, ainsi que les sources de financement (interne et externe) et les mécanismes de financement des investissements publics.', en: 'Financement international Comprendre la gestion de la dette publique, ses instruments, sa politique et surveillance, ainsi que les sources de financement (interne et externe) et les mécanismes de financement des investissements publics.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M11',
        title: { fr: 'Technologies de l\'Information et FP Apprendre l\'utilisation des technologies de l\'information et des systèmes d\'informations dans la gestion financière publique, ainsi que la sécurité des données et la protection de la confidentialité.', en: 'Technologies de l\'Information et FP Apprendre l\'utilisation des technologies de l\'information et des systèmes d\'informations dans la gestion financière publique, ainsi que la sécurité des données et la protection de la confidentialité.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M12',
        title: { fr: 'Mémoire / thèse professionnelle Offrir un apprentissage des méthodes de recherche en finances publiques et fiscalité permettant aux apprenants d\'élaborer leur mémoire sur un sujet pertinent dans leur domaine de spécialisation.', en: 'Mémoire / thèse professionnelle Offrir un apprentissage des méthodes de recherche en finances publiques et fiscalité permettant aux apprenants d\'élaborer leur mémoire sur un sujet pertinent dans leur domaine de spécialisation.' },
        description: { fr: '', en: '' },
      },
    ],
  },
  {
    slug: 'mba-gouvernance-management-public',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Gouvernance & Management Public', en: 'MBA Governance & Public Management' },
    shortPitch: { fr: 'Ce MBA vise à former des décideurs publics capables de piloter l\'action publique dans un environnement en mutation, marqué par des exigences accrues de performance, de transparence et d\'innovation.', en: 'Ce MBA vise à former des décideurs publics capables de piloter l\'action publique dans un environnement en mutation, marqué par des exigences accrues de performance, de transparence et d\'innovation.' },  // EN translation TBD
    vocation: { fr: 'Ce MBA vise à former des décideurs publics capables de piloter l\'action publique dans un environnement en mutation, marqué par des exigences accrues de performance, de transparence et d\'innovation. Il a pour ambition de développer une vision stratégique de la gouvernance publique, en intégrant les enjeux de modernisation de l\'État, de transformation digitale, de décentralisation et de développement territorial.', en: 'Ce MBA vise à former des décideurs publics capables de piloter l\'action publique dans un environnement en mutation, marqué par des exigences accrues de performance, de transparence et d\'innovation. Il a pour ambition de développer une vision stratégique de la gouvernance publique, en intégrant les enjeux de modernisation de l\'État, de transformation digitale, de décentralisation et de développement territorial.' },
    targetAudience: { fr: 'Ce programme s\'adresse à un public diversifié impliqué dans la gestion et la transformation du secteur public, notamment les cadres et responsables des administrations publiques et des collectivités territoriales, ainsi que les responsables de projets, de modernisation ou de digitalisation. Il concerne également les consultants et experts en politiques publiques et en gouvernance, les cadres d\'organisations internationales et d\'ONG.', en: 'Ce programme s\'adresse à un public diversifié impliqué dans la gestion et la transformation du secteur public, notamment les cadres et responsables des administrations publiques et des collectivités territoriales, ainsi que les responsables de projets, de modernisation ou de digitalisation. Il concerne également les consultants et experts en politiques publiques et en gouvernance, les cadres d\'organisations internationales et d\'ONG.' },
    careerOutlooks: { fr: 'Ce MBA ouvre l\'accès à des fonctions à forte responsabilité dans le secteur public, parapublic et au sein des organisations internationales. Les participants pourront évoluer vers des postes de directeur ou chef de projet au sein des administrations publiques, de responsable de programmes de réforme, de modernisation ou de transformation publique, ou encore de consultant en gouvernance, politiques publiques ou développement territorial.', en: 'Ce MBA ouvre l\'accès à des fonctions à forte responsabilité dans le secteur public, parapublic et au sein des organisations internationales. Les participants pourront évoluer vers des postes de directeur ou chef de projet au sein des administrations publiques, de responsable de programmes de réforme, de modernisation ou de transformation publique, ou encore de consultant en gouvernance, politiques publiques ou développement territorial.' },
    skillsNarrative: { fr: 'À l\'issue de la formation, les participants développent des compétences clés leur permettant d\'agir efficacement dans des environnements publics complexes, notamment en matière de conception, de pilotage et d\'évaluation des politiques publiques. Ils acquièrent une maîtrise des outils de gestion publique moderne, incluant la budgétisation, le pilotage de la performance et les dispositifs de contrôle, tout en renforçant leur leadership institutionnel et leur capacité à conduire le changement.', en: 'À l\'issue de la formation, les participants développent des compétences clés leur permettant d\'agir efficacement dans des environnements publics complexes, notamment en matière de conception, de pilotage et d\'évaluation des politiques publiques. Ils acquièrent une maîtrise des outils de gestion publique moderne, incluant la budgétisation, le pilotage de la performance et les dispositifs de contrôle, tout en renforçant leur leadership institutionnel et leur capacité à conduire le changement.' },
    objectives: [
      { fr: 'Maîtriser les logiques contemporaines de gouvernance et de pilotage des politiques publiques.', en: 'Maîtriser les logiques contemporaines de gouvernance et de pilotage des politiques publiques.' },
      { fr: 'Intégrer les principes de bonne gouvernance, d\'éthique et de performance dans l\'action publique.', en: 'Intégrer les principes de bonne gouvernance, d\'éthique et de performance dans l\'action publique.' },
      { fr: 'Renforcer leurs capacités d\'analyse, de décision et d\'évaluation des actions publiques.', en: 'Renforcer leurs capacités d\'analyse, de décision et d\'évaluation des actions publiques.' },
      { fr: 'Accompagner les transformations organisationnelles au sein des institutions publiques.', en: 'Accompagner les transformations organisationnelles au sein des institutions publiques.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: false,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Gouvernance publique : enjeux, modèles et mutations Il introduit les grandes transformations de l\'action publique à l\'échelle nationale et internationale. Il permet de comprendre les nouveaux modèles de gouvernance.', en: 'Gouvernance publique : enjeux, modèles et mutations Il introduit les grandes transformations de l\'action publique à l\'échelle nationale et internationale. Il permet de comprendre les nouveaux modèles de gouvernance.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M2',
        title: { fr: 'Ingénierie des politiques publiques', en: 'Ingénierie des politiques publiques' },
        description: { fr: 'Ce module développe une approche structurée de la conception des politiques publiques. Il aborde les différentes phases du cycle des politiques.', en: 'Ce module développe une approche structurée de la conception des politiques publiques. Il aborde les différentes phases du cycle des politiques.' },
      },
      {
        code: 'M3',
        title: { fr: 'Pilotage stratégique des finances publiques', en: 'Pilotage stratégique des finances publiques' },
        description: { fr: 'Ce module explore les mécanismes de gestion financière. Il met l\'accent sur la budgétisation orientée résultats et les outils de contrôle et de transparence.', en: 'Ce module explore les mécanismes de gestion financière. Il met l\'accent sur la budgétisation orientée résultats et les outils de contrôle et de transparence.' },
      },
      {
        code: 'M4',
        title: { fr: 'Management des talents et performance publique', en: 'Management des talents et performance publique' },
        description: { fr: 'Ce module traite des enjeux de gestion des ressources humaines dans les organisations publiques. Il aborde la motivation et l\'évaluation de la performance.', en: 'Ce module traite des enjeux de gestion des ressources humaines dans les organisations publiques. Il aborde la motivation et l\'évaluation de la performance.' },
      },
      {
        code: 'M5',
        title: { fr: 'Leadership public et communication institutionnelle', en: 'Leadership public et communication institutionnelle' },
        description: { fr: 'Ce séminaire vise à renforcer les capacités de leadership dans des environnements complexes et souvent contraints. Il met l\'accent sur la communication publique.', en: 'Ce séminaire vise à renforcer les capacités de leadership dans des environnements complexes et souvent contraints. Il met l\'accent sur la communication publique.' },
      },
      {
        code: 'M6',
        title: { fr: 'Gouvernance territoriale et développement local', en: 'Gouvernance territoriale et développement local' },
        description: { fr: 'Ce module analyse les dynamiques de décentralisation et de territorialisation de l\'action publique. Il permet de comprendre les enjeux du développement local.', en: 'Ce module analyse les dynamiques de décentralisation et de territorialisation de l\'action publique. Il permet de comprendre les enjeux du développement local.' },
      },
      {
        code: 'M7',
        title: { fr: 'Transformation digitale et innovation publique', en: 'Transformation digitale et innovation publique' },
        description: { fr: 'Ce séminaire explore le rôle du digital dans la modernisation de l\'administration publique. Il aborde les concepts d\'e-gouvernement et de digitalisation.', en: 'Ce séminaire explore le rôle du digital dans la modernisation de l\'administration publique. Il aborde les concepts d\'e-gouvernement et de digitalisation.' },
      },
      {
        code: 'M8',
        title: { fr: 'Management de projet public et performance opérationnelle', en: 'Management de projet public et performance opérationnelle' },
        description: { fr: 'Ce module permet de maîtriser les outils et méthodes de gestion de projet appliqués au secteur public. Il met l\'accent sur la planification, le suivi et l\'évaluation.', en: 'Ce module permet de maîtriser les outils et méthodes de gestion de projet appliqués au secteur public. Il met l\'accent sur la planification, le suivi et l\'évaluation.' },
      },
      {
        code: 'M9',
        title: { fr: 'Éthique, transparence et redevabilité publique', en: 'Éthique, transparence et redevabilité publique' },
        description: { fr: 'Ce module traite des enjeux de gouvernance éthique et de lutte contre la corruption. Il permet de comprendre les mécanismes de transparence et de contrôle interne.', en: 'Ce module traite des enjeux de gouvernance éthique et de lutte contre la corruption. Il permet de comprendre les mécanismes de transparence et de contrôle interne.' },
      },
      {
        code: 'M10',
        title: { fr: 'Partenariats public-privé et financement des projets publics', en: 'Partenariats public-privé et financement des projets publics' },
        description: { fr: 'Ce module explore les logiques de collaboration entre secteurs public et privé. Il aborde les montages contractuels et les mécanismes de financement innovants.', en: 'Ce module explore les logiques de collaboration entre secteurs public et privé. Il aborde les montages contractuels et les mécanismes de financement innovants.' },
      },
      {
        code: 'M11',
        title: { fr: 'Évaluation et impact des politiques publiques', en: 'Évaluation et impact des politiques publiques' },
        description: { fr: 'Ce module est consacré aux méthodes d\'évaluation des PP. Il permet d\'analyser les résultats, de mesurer les impacts et d\'intégrer une logique d\'amélioration.', en: 'Ce module est consacré aux méthodes d\'évaluation des PP. Il permet d\'analyser les résultats, de mesurer les impacts et d\'intégrer une logique d\'amélioration.' },
      },
      {
        code: 'M12',
        title: { fr: 'Méthodologie de recherche et mémoire professionnel', en: 'Méthodologie de recherche et mémoire professionnel' },
        description: { fr: 'Ce séminaire accompagne les participants dans la réalisation de leur mémoire. Il vise à mobiliser les acquis du programme pour traiter une problématique réelle.', en: 'Ce séminaire accompagne les participants dans la réalisation de leur mémoire. Il vise à mobiliser les acquis du programme pour traiter une problématique réelle.' },
      },
    ],
  },
  {
    slug: 'mba-gouvernance-ressources-minieres',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Gouvernance Stratégique & Valorisation des Ressources Minières', en: 'MBA Strategic Governance & Valorisation of Mining Resources' },
    shortPitch: { fr: 'Ce MBA vise à former des décideurs capables de piloter la gouvernance stratégique des ressources minières dans un contexte marqué par la compétition internationale, les enjeux de souveraineté économique et les exigences de développement durable.', en: 'Ce MBA vise à former des décideurs capables de piloter la gouvernance stratégique des ressources minières dans un contexte marqué par la compétition internationale, les enjeux de souveraineté économique et les exigences de développement durable.' },  // EN translation TBD
    vocation: { fr: 'Ce MBA vise à former des décideurs capables de piloter la gouvernance stratégique des ressources minières dans un contexte marqué par la compétition internationale, les enjeux de souveraineté économique et les exigences de développement durable. Il a pour ambition de doter les participants d\'une compréhension approfondie des chaînes de valeur minières, des mécanismes de négociation et des logiques de création de valeur.', en: 'Ce MBA vise à former des décideurs capables de piloter la gouvernance stratégique des ressources minières dans un contexte marqué par la compétition internationale, les enjeux de souveraineté économique et les exigences de développement durable. Il a pour ambition de doter les participants d\'une compréhension approfondie des chaînes de valeur minières, des mécanismes de négociation et des logiques de création de valeur.' },
    targetAudience: { fr: 'Ce programme s\'adresse à des profils à responsabilité ou à fort potentiel évoluant dans les secteurs liés aux ressources naturelles. Il cible notamment les cadres des ministères, des agences publiques et des institutions de régulation, ainsi que les dirigeants et cadres supérieurs des entreprises minières et énergétiques. Il s\'adresse également aux consultants, juristes et experts des industries extractives, aux investisseurs, banquiers et acteurs du financement de projets miniers.', en: 'Ce programme s\'adresse à des profils à responsabilité ou à fort potentiel évoluant dans les secteurs liés aux ressources naturelles. Il cible notamment les cadres des ministères, des agences publiques et des institutions de régulation, ainsi que les dirigeants et cadres supérieurs des entreprises minières et énergétiques. Il s\'adresse également aux consultants, juristes et experts des industries extractives, aux investisseurs, banquiers et acteurs du financement de projets miniers.' },
    careerOutlooks: { fr: 'Ce MBA ouvre l\'accès à des fonctions stratégiques dans les secteurs public et privé liés aux industries extractives. Il prépare les participants à occuper des postes de cadres supérieurs au sein des ministères des mines, de l\'énergie ou de l\'industrie, ainsi que des fonctions de direction ou de responsabilité dans les entreprises minières. Il permet également d\'évoluer vers des métiers de consultant en gouvernance, en politiques extractives ou en développement territorial.', en: 'Ce MBA ouvre l\'accès à des fonctions stratégiques dans les secteurs public et privé liés aux industries extractives. Il prépare les participants à occuper des postes de cadres supérieurs au sein des ministères des mines, de l\'énergie ou de l\'industrie, ainsi que des fonctions de direction ou de responsabilité dans les entreprises minières. Il permet également d\'évoluer vers des métiers de consultant en gouvernance, en politiques extractives ou en développement territorial.' },
    skillsNarrative: { fr: 'À l\'issue du programme, les participants seront capables d\'analyser les dynamiques géopolitiques et économiques liées aux ressources minières, de concevoir des stratégies de valorisation à forte valeur ajoutée et de maîtriser les cadres juridiques, fiscaux et contractuels du secteur. Ils développeront également des compétences en pilotage de projets extractifs dans une logique de performance et de durabilité, tout en intégrant les enjeux ESG, environnementaux et sociaux dans leurs décisions stratégiques.', en: 'À l\'issue du programme, les participants seront capables d\'analyser les dynamiques géopolitiques et économiques liées aux ressources minières, de concevoir des stratégies de valorisation à forte valeur ajoutée et de maîtriser les cadres juridiques, fiscaux et contractuels du secteur. Ils développeront également des compétences en pilotage de projets extractifs dans une logique de performance et de durabilité, tout en intégrant les enjeux ESG, environnementaux et sociaux dans leurs décisions stratégiques.' },
    objectives: [
      { fr: 'Maîtriser les enjeux géopolitiques et économiques des ressources minières stratégiques.', en: 'Maîtriser les enjeux géopolitiques et économiques des ressources minières stratégiques.' },
      { fr: 'Piloter des projets miniers dans une logique de création de valeur durable & Négocier et structurer des PPP complexes.', en: 'Piloter des projets miniers dans une logique de création de valeur durable & Négocier et structurer des PPP complexes.' },
      { fr: 'Comprendre les mécanismes de gouvernance et de régulation du secteur extractif.', en: 'Comprendre les mécanismes de gouvernance et de régulation du secteur extractif.' },
      { fr: 'Renforcer la capacité des états et des organisations à valoriser leurs ressources minières.', en: 'Renforcer la capacité des états et des organisations à valoriser leurs ressources minières.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: true,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Géopolitique des ressources minières en Afrique', en: 'Géopolitique des ressources minières en Afrique' },
        description: { fr: 'Ce séminaire introduit les grandes dynamiques géoéconomiques liées aux ressources stratégiques (cobalt, lithium, cuivre, bauxite, phosphates...).', en: 'Ce séminaire introduit les grandes dynamiques géoéconomiques liées aux ressources stratégiques (cobalt, lithium, cuivre, bauxite, phosphates...).' },
      },
      {
        code: 'M2',
        title: { fr: 'Cartographie des ressources et intelligence géologique', en: 'Cartographie des ressources et intelligence géologique' },
        description: { fr: 'Ce module explore les enjeux liés à la connaissance et à la valorisation des ressources du sous-sol. Il aborde les outils de cartographie et les politiques d\'exploration.', en: 'Ce module explore les enjeux liés à la connaissance et à la valorisation des ressources du sous-sol. Il aborde les outils de cartographie et les politiques d\'exploration.' },
      },
      {
        code: 'M3',
        title: { fr: 'Gouvernance des industries extractives et rôle de l\'État', en: 'Gouvernance des industries extractives et rôle de l\'État' },
        description: { fr: 'Ce module analyse les modèles de gouvernance du secteur minier. Il met en lumière le rôle des institutions publiques, les cadres de régulation et la transparence.', en: 'Ce module analyse les modèles de gouvernance du secteur minier. Il met en lumière le rôle des institutions publiques, les cadres de régulation et la transparence.' },
      },
      {
        code: 'M4',
        title: { fr: 'Droit minier, fiscalité et négociation des contrats', en: 'Droit minier, fiscalité et négociation des contrats' },
        description: { fr: 'Ce module traite des cadres juridiques et fiscaux encadrant l\'exploitation minière. Il met l\'accent sur la négociation, les régimes fiscaux et les enjeux de souveraineté.', en: 'Ce module traite des cadres juridiques et fiscaux encadrant l\'exploitation minière. Il met l\'accent sur la négociation, les régimes fiscaux et les enjeux de souveraineté.' },
      },
      {
        code: 'M5',
        title: { fr: 'Modèles économiques et chaînes de valeur minières', en: 'Modèles économiques et chaînes de valeur minières' },
        description: { fr: 'Ce séminaire explore la structuration des chaînes de valeur. Il analyse les stratégies permettant de passer d\'une logique d\'exportation à une logique de transformation.', en: 'Ce séminaire explore la structuration des chaînes de valeur. Il analyse les stratégies permettant de passer d\'une logique d\'exportation à une logique de transformation.' },
      },
      {
        code: 'M6',
        title: { fr: 'Financement des projets miniers et partenariats internationaux', en: 'Financement des projets miniers et partenariats internationaux' },
        description: { fr: 'Ce module aborde les mécanismes de financement des projets extractifs (PPP, banques, fonds souverains, investisseurs internationaux).', en: 'Ce module aborde les mécanismes de financement des projets extractifs (PPP, banques, fonds souverains, investisseurs internationaux).' },
      },
      {
        code: 'M7',
        title: { fr: 'Industrialisation et valorisation locale des ressources', en: 'Industrialisation et valorisation locale des ressources' },
        description: { fr: 'Ce séminaire met l\'accent sur les stratégies d\'industrialisation liées aux ressources naturelles. Il analyse les politiques de contenu local et les clusters industriels.', en: 'Ce séminaire met l\'accent sur les stratégies d\'industrialisation liées aux ressources naturelles. Il analyse les politiques de contenu local et les clusters industriels.' },
      },
      {
        code: 'M8',
        title: { fr: 'Enjeux ESG, environnement et acceptabilité sociale', en: 'Enjeux ESG, environnement et acceptabilité sociale' },
        description: { fr: 'Ce module traite des impacts environnementaux et sociaux de l\'activité minière. Il aborde les normes ESG, la gestion des communautés locales et la RSE.', en: 'Ce module traite des impacts environnementaux et sociaux de l\'activité minière. Il aborde les normes ESG, la gestion des communautés locales et la RSE.' },
      },
      {
        code: 'M9',
        title: { fr: 'Logistique minière et infrastructures stratégiques', en: 'Logistique minière et infrastructures stratégiques' },
        description: { fr: 'Ce séminaire explore les enjeux logistiques liés à l\'exploitation minière (transport, ports, corridors). Il met en lumière le rôle des infrastructures dans la compétitivité.', en: 'Ce séminaire explore les enjeux logistiques liés à l\'exploitation minière (transport, ports, corridors). Il met en lumière le rôle des infrastructures dans la compétitivité.' },
      },
      {
        code: 'M10',
        title: { fr: 'IE et sécurité des ressources stratégiques', en: 'IE et sécurité des ressources stratégiques' },
        description: { fr: 'Ce module développe une approche d\'intelligence économique appliquée aux ressources naturelles. Il aborde la protection des intérêts stratégiques.', en: 'Ce module développe une approche d\'intelligence économique appliquée aux ressources naturelles. Il aborde la protection des intérêts stratégiques.' },
      },
      {
        code: 'M11',
        title: { fr: 'Stratégies nationales et souveraineté minière', en: 'Stratégies nationales et souveraineté minière' },
        description: { fr: 'Ce séminaire analyse les politiques publiques visant à renforcer la souveraineté sur les ressources. Il compare différentes stratégies africaines et internationales.', en: 'Ce séminaire analyse les politiques publiques visant à renforcer la souveraineté sur les ressources. Il compare différentes stratégies africaines et internationales.' },
      },
      {
        code: 'M12',
        title: { fr: 'Méthodologie de recherche et mémoire professionnel Ce dernier séminaire accompagne les participants dans la réalisation d\'un projet stratégique ou mémoire professionnel. Il vise à traiter une problématique réelle.', en: 'Méthodologie de recherche et mémoire professionnel Ce dernier séminaire accompagne les participants dans la réalisation d\'un projet stratégique ou mémoire professionnel. Il vise à traiter une problématique réelle.' },
        description: { fr: '', en: '' },
      },
    ],
  },
  {
    slug: 'mba-management-projets',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Management de Projets', en: 'MBA Project Management' },
    shortPitch: { fr: 'Ce programme vise à former des professionnels capables de concevoir, piloter et réussir des projets dans des environnements complexes.', en: 'Ce programme vise à former des professionnels capables de concevoir, piloter et réussir des projets dans des environnements complexes.' },  // EN translation TBD
    vocation: { fr: 'Ce programme vise à former des professionnels capables de concevoir, piloter et réussir des projets dans des environnements complexes. Il permet d\'acquérir une maîtrise approfondie des méthodes, outils et référentiels internationaux en management de projet, tout en développant des compétences en leadership, en gestion des risques et en pilotage de la performance.', en: 'Ce programme vise à former des professionnels capables de concevoir, piloter et réussir des projets dans des environnements complexes. Il permet d\'acquérir une maîtrise approfondie des méthodes, outils et référentiels internationaux en management de projet, tout en développant des compétences en leadership, en gestion des risques et en pilotage de la performance.' },
    targetAudience: { fr: 'Ce MBA s\'adresse aux professionnels souhaitant renforcer ou développer leurs compétences en management de projet, notamment les chefs de projet, coordinateurs, ingénieurs et responsables opérationnels engagés dans la conduite d\'activités complexes. Il cible également les cadres désireux d\'évoluer vers des fonctions de pilotage stratégique, ainsi que les consultants et professionnels impliqués dans des projets de transformation.', en: 'Ce MBA s\'adresse aux professionnels souhaitant renforcer ou développer leurs compétences en management de projet, notamment les chefs de projet, coordinateurs, ingénieurs et responsables opérationnels engagés dans la conduite d\'activités complexes. Il cible également les cadres désireux d\'évoluer vers des fonctions de pilotage stratégique, ainsi que les consultants et professionnels impliqués dans des projets de transformation.' },
    careerOutlooks: { fr: 'Ce MBA ouvre l\'accès à des fonctions à forte responsabilité dans divers secteurs d\'activité, notamment des postes de chef de projet ou Project Manager, ainsi que de consultant en management de projet ou en transformation. Il permet également d\'évoluer vers des fonctions de responsable PMO, de manager de projets stratégiques ou d\'innovation, ou encore de responsable de portefeuille projets, en pilotant des initiatives complexes à fort impact.', en: 'Ce MBA ouvre l\'accès à des fonctions à forte responsabilité dans divers secteurs d\'activité, notamment des postes de chef de projet ou Project Manager, ainsi que de consultant en management de projet ou en transformation. Il permet également d\'évoluer vers des fonctions de responsable PMO, de manager de projets stratégiques ou d\'innovation, ou encore de responsable de portefeuille projets, en pilotant des initiatives complexes à fort impact.' },
    skillsNarrative: { fr: 'À l\'issue de la formation, les participants seront en mesure de concevoir, planifier, exécuter et piloter des projets de manière structurée, en mobilisant les principaux outils et méthodes de gestion de projet, qu\'ils soient classiques ou agiles. Ils sauront gérer efficacement les risques, les délais, les coûts et la qualité, tout en coordonnant des équipes pluridisciplinaires. Le programme permettra également de piloter des portefeuilles de projets, de contribuer à la gouvernance des organisations et d\'accompagner le changement.', en: 'À l\'issue de la formation, les participants seront en mesure de concevoir, planifier, exécuter et piloter des projets de manière structurée, en mobilisant les principaux outils et méthodes de gestion de projet, qu\'ils soient classiques ou agiles. Ils sauront gérer efficacement les risques, les délais, les coûts et la qualité, tout en coordonnant des équipes pluridisciplinaires. Le programme permettra également de piloter des portefeuilles de projets, de contribuer à la gouvernance des organisations et d\'accompagner le changement.' },
    objectives: [
      { fr: 'Structurer, planifier et piloter efficacement un projet selon les standards internationaux (PMI, Agile, etc.).', en: 'Structurer, planifier et piloter efficacement un projet selon les standards internationaux (PMI, Agile, etc.).' },
      { fr: 'Mobiliser et coordonner les équipes en développant un leadership adapté aux environnements complexes.', en: 'Mobiliser et coordonner les équipes en développant un leadership adapté aux environnements complexes.' },
      { fr: 'Prendre des décisions stratégiques permettant d\'optimiser les ressources, les délais et la création de valeur.', en: 'Prendre des décisions stratégiques permettant d\'optimiser les ressources, les délais et la création de valeur.' },
      { fr: 'Utiliser les outils et systèmes de gestion de projet pour assurer le suivi, le contrôle et la performance.', en: 'Utiliser les outils et systèmes de gestion de projet pour assurer le suivi, le contrôle et la performance.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: false,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Principes fondamentaux et structuration des projets', en: 'Principes fondamentaux et structuration des projets' },
        description: { fr: 'Ce séminaire introduit les bases du MP en abordant les concepts clés, le cycle de vie des projets ainsi que les rôles et responsabilités des acteurs impliqués.', en: 'Ce séminaire introduit les bases du MP en abordant les concepts clés, le cycle de vie des projets ainsi que les rôles et responsabilités des acteurs impliqués.' },
      },
      {
        code: 'M2',
        title: { fr: 'Planification opérationnelle et outils de pilotage Les participants apprennent à organiser les tâches, à gérer les délais et à optimiser l\'allocation des ressources, tout en maîtrisant les outils numériques.', en: 'Planification opérationnelle et outils de pilotage Les participants apprennent à organiser les tâches, à gérer les délais et à optimiser l\'allocation des ressources, tout en maîtrisant les outils numériques.' },
        description: { fr: '', en: '' },
      },
      {
        code: 'M3',
        title: { fr: 'Anticipation et gestion des risques projet', en: 'Anticipation et gestion des risques projet' },
        description: { fr: 'Ce séminaire met l\'accent sur l\'identification, l\'analyse et la maîtrise des risques. Il permet de développer une approche proactive.', en: 'Ce séminaire met l\'accent sur l\'identification, l\'analyse et la maîtrise des risques. Il permet de développer une approche proactive.' },
      },
      {
        code: 'M4',
        title: { fr: 'Pilotage financier et maîtrise budgétaire des projets', en: 'Pilotage financier et maîtrise budgétaire des projets' },
        description: { fr: 'Ce module aborde les dimensions financières du management de projet, notamment l\'estimation des coûts, le suivi budgétaire et l\'évaluation de la rentabilité.', en: 'Ce module aborde les dimensions financières du management de projet, notamment l\'estimation des coûts, le suivi budgétaire et l\'évaluation de la rentabilité.' },
      },
      {
        code: 'M5',
        title: { fr: 'Leadership et management des équipes projet', en: 'Leadership et management des équipes projet' },
        description: { fr: 'Ce séminaire développe les compétences managériales nécessaires à la conduite des équipes projet.', en: 'Ce séminaire développe les compétences managériales nécessaires à la conduite des équipes projet.' },
      },
      {
        code: 'M6',
        title: { fr: 'Approches agiles et innovation dans les projets', en: 'Approches agiles et innovation dans les projets' },
        description: { fr: 'Ce module introduit les méthodes agiles et leurs applications dans la gestion de projet. Il met en avant les logiques d\'adaptation, d\'itération et d\'amélioration continue.', en: 'Ce module introduit les méthodes agiles et leurs applications dans la gestion de projet. Il met en avant les logiques d\'adaptation, d\'itération et d\'amélioration continue.' },
      },
      {
        code: 'M7',
        title: { fr: 'Qualité, performance et amélioration continue des projets', en: 'Qualité, performance et amélioration continue des projets' },
        description: { fr: 'Ce séminaire traite du pilotage de la qualité et de la performance à travers des indicateurs pertinents et des outils de contrôle.', en: 'Ce séminaire traite du pilotage de la qualité et de la performance à travers des indicateurs pertinents et des outils de contrôle.' },
      },
      {
        code: 'M8',
        title: { fr: 'Communication stratégique et gestion des parties prenantes', en: 'Communication stratégique et gestion des parties prenantes' },
        description: { fr: 'Ce module développe les compétences en communication dans un contexte projet. Il aborde l\'analyse des parties prenantes et la gestion de leurs attentes.', en: 'Ce module développe les compétences en communication dans un contexte projet. Il aborde l\'analyse des parties prenantes et la gestion de leurs attentes.' },
      },
      {
        code: 'M9',
        title: { fr: 'Conduite du changement et accompagnement', en: 'Conduite du changement et accompagnement' },
        description: { fr: 'Ce séminaire permet de comprendre les dynamiques de changement. Il propose des outils pour gérer les résistances et favoriser l\'adhésion des équipes.', en: 'Ce séminaire permet de comprendre les dynamiques de changement. Il propose des outils pour gérer les résistances et favoriser l\'adhésion des équipes.' },
      },
      {
        code: 'M10',
        title: { fr: 'Gestion de portefeuille projets et gouvernance PMO', en: 'Gestion de portefeuille projets et gouvernance PMO' },
        description: { fr: 'Ce module élargit la perspective au pilotage simultané de plusieurs projets. Il aborde les mécanismes de priorisation et les outils de reporting.', en: 'Ce module élargit la perspective au pilotage simultané de plusieurs projets. Il aborde les mécanismes de priorisation et les outils de reporting.' },
      },
      {
        code: 'M11',
        title: { fr: 'Management des projets complexes et internationaux', en: 'Management des projets complexes et internationaux' },
        description: { fr: 'Ce séminaire traite des spécificités des projets à forte complexité, notamment dans des environnements multiculturels.', en: 'Ce séminaire traite des spécificités des projets à forte complexité, notamment dans des environnements multiculturels.' },
      },
      {
        code: 'M12',
        title: { fr: 'Méthodologie de recherche et mémoire professionnel', en: 'Méthodologie de recherche et mémoire professionnel' },
        description: { fr: 'Ce module accompagne les participants dans la structuration de leur mémoire professionnel. Il aborde la formulation de la problématique et les choix méthodologiques.', en: 'Ce module accompagne les participants dans la structuration de leur mémoire professionnel. Il aborde la formulation de la problématique et les choix méthodologiques.' },
      },
    ],
  },
  {
    slug: 'mba-management-strategique-intelligence-economique',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Management Stratégique & Intelligence Économique', en: 'MBA Strategic Management & Business Intelligence' },
    shortPitch: { fr: 'Ce MBA vise à former des décideurs capables d\'anticiper, d\'analyser et d\'agir dans des environnements complexes et incertains, en mobilisant les outils du management stratégique et de l\'intelligence économique.', en: 'Ce MBA vise à former des décideurs capables d\'anticiper, d\'analyser et d\'agir dans des environnements complexes et incertains, en mobilisant les outils du management stratégique et de l\'intelligence économique.' },  // EN translation TBD
    vocation: { fr: 'Ce MBA vise à former des décideurs capables d\'anticiper, d\'analyser et d\'agir dans des environnements complexes et incertains, en mobilisant les outils du management stratégique et de l\'intelligence économique. Il a pour ambition de développer une capacité à transformer l\'information en avantage concurrentiel, à sécuriser les décisions stratégiques et à renforcer la compétitivité des organisations.', en: 'Ce MBA vise à former des décideurs capables d\'anticiper, d\'analyser et d\'agir dans des environnements complexes et incertains, en mobilisant les outils du management stratégique et de l\'intelligence économique. Il a pour ambition de développer une capacité à transformer l\'information en avantage concurrentiel, à sécuriser les décisions stratégiques et à renforcer la compétitivité des organisations.' },
    targetAudience: { fr: 'Ce programme s\'adresse à des profils souhaitant évoluer vers des fonctions stratégiques et décisionnelles, notamment les cadres et managers impliqués dans la stratégie ou le développement des organisations. Il concerne également les responsables en veille, marketing stratégique, business intelligence ou études, ainsi que les consultants en stratégie, organisation ou transformation. Le MBA s\'adresse aussi aux cadres du secteur public ou parapublic.', en: 'Ce programme s\'adresse à des profils souhaitant évoluer vers des fonctions stratégiques et décisionnelles, notamment les cadres et managers impliqués dans la stratégie ou le développement des organisations. Il concerne également les responsables en veille, marketing stratégique, business intelligence ou études, ainsi que les consultants en stratégie, organisation ou transformation. Le MBA s\'adresse aussi aux cadres du secteur public ou parapublic.' },
    careerOutlooks: { fr: 'Ce MBA ouvre l\'accès à des fonctions stratégiques à forte valeur ajoutée au sein des entreprises, des institutions publiques et des cabinets de conseil. Les participants pourront évoluer vers des postes de responsable stratégie ou développement stratégique, de responsable veille stratégique et intelligence économique, ou encore de consultant en stratégie, intelligence économique ou transformation organisationnelle.', en: 'Ce MBA ouvre l\'accès à des fonctions stratégiques à forte valeur ajoutée au sein des entreprises, des institutions publiques et des cabinets de conseil. Les participants pourront évoluer vers des postes de responsable stratégie ou développement stratégique, de responsable veille stratégique et intelligence économique, ou encore de consultant en stratégie, intelligence économique ou transformation organisationnelle.' },
    skillsNarrative: { fr: 'À l\'issue du programme, les participants seront capables d\'analyser l\'environnement concurrentiel et les dynamiques sectorielles, tout en mettant en place des dispositifs de veille stratégique et informationnelle performants. Ils sauront exploiter les données pour orienter les décisions stratégiques, anticiper les risques économiques, informationnels et géopolitiques, et concevoir des stratégies innovantes adaptées à des contextes incertains.', en: 'À l\'issue du programme, les participants seront capables d\'analyser l\'environnement concurrentiel et les dynamiques sectorielles, tout en mettant en place des dispositifs de veille stratégique et informationnelle performants. Ils sauront exploiter les données pour orienter les décisions stratégiques, anticiper les risques économiques, informationnels et géopolitiques, et concevoir des stratégies innovantes adaptées à des contextes incertains.' },
    objectives: [
      { fr: 'Analyser les environnements concurrentiels et anticiper les évolutions stratégiques des marchés.', en: 'Analyser les environnements concurrentiels et anticiper les évolutions stratégiques des marchés.' },
      { fr: 'Mettre en place des dispositifs d\'intelligence économique au service de la performance organisationnelle.', en: 'Mettre en place des dispositifs d\'intelligence économique au service de la performance organisationnelle.' },
      { fr: 'Élaborer et piloter des stratégies visant à renforcer la compétitivité et la résilience des organisations.', en: 'Élaborer et piloter des stratégies visant à renforcer la compétitivité et la résilience des organisations.' },
      { fr: 'Identifier et gérer les risques stratégiques, informationnels et concurrentiels dans des contextes incertains.', en: 'Identifier et gérer les risques stratégiques, informationnels et concurrentiels dans des contextes incertains.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: true,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Pensée stratégique et dynamiques concurrentielles', en: 'Pensée stratégique et dynamiques concurrentielles' },
        description: { fr: 'Ce séminaire introduit les fondements du management stratégique dans un environnement globalisé. Il permet d\'analyser les dynamiques concurrentielles.', en: 'Ce séminaire introduit les fondements du management stratégique dans un environnement globalisé. Il permet d\'analyser les dynamiques concurrentielles.' },
      },
      {
        code: 'M2',
        title: { fr: 'Analyse de l\'environnement et veille stratégique', en: 'Analyse de l\'environnement et veille stratégique' },
        description: { fr: 'Ce module développe les capacités d\'observation et d\'anticipation à travers la mise en place de dispositifs de veille. Il aborde les outils d\'analyse de l\'environnement.', en: 'Ce module développe les capacités d\'observation et d\'anticipation à travers la mise en place de dispositifs de veille. Il aborde les outils d\'analyse de l\'environnement.' },
      },
      {
        code: 'M3',
        title: { fr: 'Intelligence économique et information stratégique', en: 'Intelligence économique et information stratégique' },
        description: { fr: 'Ce séminaire explore les principes et les pratiques de l\'intelligence économique. Il met l\'accent sur la collecte, le traitement, la diffusion et la protection de l\'information.', en: 'Ce séminaire explore les principes et les pratiques de l\'intelligence économique. Il met l\'accent sur la collecte, le traitement, la diffusion et la protection de l\'information.' },
      },
      {
        code: 'M4',
        title: { fr: 'Outils d\'aide à la décision stratégique', en: 'Outils d\'aide à la décision stratégique' },
        description: { fr: 'Ce module présente les outils d\'analyse et de modélisation permettant de structurer la prise de décision. Il permet de relier données, analyses et décisions.', en: 'Ce module présente les outils d\'analyse et de modélisation permettant de structurer la prise de décision. Il permet de relier données, analyses et décisions.' },
      },
      {
        code: 'M5',
        title: { fr: 'Business intelligence et exploitation des données', en: 'Business intelligence et exploitation des données' },
        description: { fr: 'Ce module traite de l\'utilisation des données comme levier stratégique. Il aborde les outils de business intelligence et l\'analyse de données.', en: 'Ce module traite de l\'utilisation des données comme levier stratégique. Il aborde les outils de business intelligence et l\'analyse de données.' },
      },
      {
        code: 'M6',
        title: { fr: 'Stratégies d\'entreprise et modèles de croissance', en: 'Stratégies d\'entreprise et modèles de croissance' },
        description: { fr: 'Ce module explore les différentes stratégies de développement. Il permet de comprendre les choix stratégiques dans des environnements incertains.', en: 'Ce module explore les différentes stratégies de développement. Il permet de comprendre les choix stratégiques dans des environnements incertains.' },
      },
      {
        code: 'M7',
        title: { fr: 'Intelligence géopolitique et enjeux économiques globaux', en: 'Intelligence géopolitique et enjeux économiques globaux' },
        description: { fr: 'Ce séminaire analyse les interactions entre économie, politique et stratégie. Il met en lumière les enjeux géopolitiques et les rapports de force économiques.', en: 'Ce séminaire analyse les interactions entre économie, politique et stratégie. Il met en lumière les enjeux géopolitiques et les rapports de force économiques.' },
      },
      {
        code: 'M8',
        title: { fr: 'Pilotage de la performance stratégique', en: 'Pilotage de la performance stratégique' },
        description: { fr: 'Ce séminaire permet de mesurer et piloter la performance des stratégies mises en œuvre. Il aborde les indicateurs de performance et les tableaux de bord stratégiques.', en: 'Ce séminaire permet de mesurer et piloter la performance des stratégies mises en œuvre. Il aborde les indicateurs de performance et les tableaux de bord stratégiques.' },
      },
      {
        code: 'M9',
        title: { fr: 'Gestion des risques stratégiques et résilience organisationnelle', en: 'Gestion des risques stratégiques et résilience organisationnelle' },
        description: { fr: 'Ce module développe les capacités d\'identification, d\'analyse et de gestion des risques. Il aborde les stratégies de résilience et d\'adaptation face aux incertitudes.', en: 'Ce module développe les capacités d\'identification, d\'analyse et de gestion des risques. Il aborde les stratégies de résilience et d\'adaptation face aux incertitudes.' },
      },
      {
        code: 'M10',
        title: { fr: 'Influence, lobbying et guerre économique', en: 'Influence, lobbying et guerre économique' },
        description: { fr: 'Ce module traite des stratégies d\'influence dans les environnements concurrentiels. Il explore les mécanismes de lobbying, de communication stratégique et de guerre.', en: 'Ce module traite des stratégies d\'influence dans les environnements concurrentiels. Il explore les mécanismes de lobbying, de communication stratégique et de guerre.' },
      },
      {
        code: 'M11',
        title: { fr: 'Protection de l\'information et sécurité économique', en: 'Protection de l\'information et sécurité économique' },
        description: { fr: 'Ce module met l\'accent sur la sécurisation des actifs immatériels et la protection de l\'information stratégique. Il aborde les enjeux de cybersécurité et de souveraineté.', en: 'Ce module met l\'accent sur la sécurisation des actifs immatériels et la protection de l\'information stratégique. Il aborde les enjeux de cybersécurité et de souveraineté.' },
      },
      {
        code: 'M12',
        title: { fr: 'Méthodologie de recherche et mémoire professionnel Ce dernier séminaire accompagne les participants dans la réalisation d\'un projet stratégique ou d\'un mémoire appliqué. Il vise à mobiliser l\'ensemble des outils étudiés.', en: 'Méthodologie de recherche et mémoire professionnel Ce dernier séminaire accompagne les participants dans la réalisation d\'un projet stratégique ou d\'un mémoire appliqué. Il vise à mobiliser l\'ensemble des outils étudiés.' },
        description: { fr: '', en: '' },
      },
    ],
  },
  {
    slug: 'mba-marketing-digital-communication',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Marketing Digital & Communication', en: 'MBA Digital Marketing & Communication' },
    shortPitch: { fr: 'Ce MBA a pour ambition de former des profils capables de piloter la stratégie digitale des organisations dans un environnement marqué par l\'accélération des usages numériques.', en: 'Ce MBA a pour ambition de former des profils capables de piloter la stratégie digitale des organisations dans un environnement marqué par l\'accélération des usages numériques.' },  // EN translation TBD
    vocation: { fr: 'Ce MBA a pour ambition de former des profils capables de piloter la stratégie digitale des organisations dans un environnement marqué par l\'accélération des usages numériques. Il ne se limite pas à la maîtrise des outils du marketing digital, mais vise à développer une vision stratégique intégrée, permettant de concevoir, déployer et optimiser des dispositifs de communication.', en: 'Ce MBA a pour ambition de former des profils capables de piloter la stratégie digitale des organisations dans un environnement marqué par l\'accélération des usages numériques. Il ne se limite pas à la maîtrise des outils du marketing digital, mais vise à développer une vision stratégique intégrée, permettant de concevoir, déployer et optimiser des dispositifs de communication.' },
    targetAudience: { fr: 'Ce programme s\'adresse à des professionnels du marketing et de la communication souhaitant se spécialiser ou évoluer vers le digital, ainsi qu\'à des responsables ou chefs de projet désireux de piloter des stratégies digitales au sein de leur organisation. Il concerne également les entrepreneurs souhaitant renforcer leur visibilité et leurs performances en ligne, ainsi que les diplômés en marketing, gestion ou communication.', en: 'Ce programme s\'adresse à des professionnels du marketing et de la communication souhaitant se spécialiser ou évoluer vers le digital, ainsi qu\'à des responsables ou chefs de projet désireux de piloter des stratégies digitales au sein de leur organisation. Il concerne également les entrepreneurs souhaitant renforcer leur visibilité et leurs performances en ligne, ainsi que les diplômés en marketing, gestion ou communication.' },
    careerOutlooks: { fr: 'Ce MBA ouvre l\'accès à des fonctions clés dans le marketing et la communication digitale, notamment des postes de responsable marketing digital ou Digital Marketing Manager, ainsi que de responsable communication digitale ou Social Media Manager. Il permet également d\'évoluer vers des fonctions de consultant en stratégie digitale ou e-business, de responsable e-réputation et brand content, ou encore de traffic manager spécialisé en acquisition digitale.', en: 'Ce MBA ouvre l\'accès à des fonctions clés dans le marketing et la communication digitale, notamment des postes de responsable marketing digital ou Digital Marketing Manager, ainsi que de responsable communication digitale ou Social Media Manager. Il permet également d\'évoluer vers des fonctions de consultant en stratégie digitale ou e-business, de responsable e-réputation et brand content, ou encore de traffic manager spécialisé en acquisition digitale.' },
    skillsNarrative: { fr: 'À l\'issue du MBA, les participants seront capables d\'élaborer et de piloter des stratégies de marketing digital globales et cohérentes, en s\'appuyant sur une analyse fine des comportements des consommateurs dans un environnement numérique. Ils sauront concevoir et déployer des campagnes multicanales (SEO, SEA, social media, email marketing), produire des contenus à forte valeur ajoutée et gérer efficacement l\'image de marque en ligne.', en: 'À l\'issue du MBA, les participants seront capables d\'élaborer et de piloter des stratégies de marketing digital globales et cohérentes, en s\'appuyant sur une analyse fine des comportements des consommateurs dans un environnement numérique. Ils sauront concevoir et déployer des campagnes multicanales (SEO, SEA, social media, email marketing), produire des contenus à forte valeur ajoutée et gérer efficacement l\'image de marque en ligne.' },
    objectives: [
      { fr: 'Élaborer et piloter une stratégie digitale alignée avec les objectifs globaux de l\'organisation.', en: 'Élaborer et piloter une stratégie digitale alignée avec les objectifs globaux de l\'organisation.' },
      { fr: 'Analyser les comportements des consommateurs connectés pour optimiser les actions marketing.', en: 'Analyser les comportements des consommateurs connectés pour optimiser les actions marketing.' },
      { fr: 'Exploiter les données et les outils digitaux afin d\'améliorer la performance et le ROI des campagnes.', en: 'Exploiter les données et les outils digitaux afin d\'améliorer la performance et le ROI des campagnes.' },
      { fr: 'Créer des contenus à forte valeur ajoutée et intégrer les technologies digitales dans une logique d\'innovation marketing.', en: 'Créer des contenus à forte valeur ajoutée et intégrer les technologies digitales dans une logique d\'innovation marketing.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: true,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Enjeux stratégiques du marketing digital', en: 'Enjeux stratégiques du marketing digital' },
        description: { fr: 'Ce séminaire pose les bases du marketing digital en adoptant une vision stratégique. Il permet de comprendre comment le digital redéfinit les modèles économiques.', en: 'Ce séminaire pose les bases du marketing digital en adoptant une vision stratégique. Il permet de comprendre comment le digital redéfinit les modèles économiques.' },
      },
      {
        code: 'M2',
        title: { fr: 'Intelligence client et data marketing', en: 'Intelligence client et data marketing' },
        description: { fr: 'Ce module explore l\'exploitation des données dans la compréhension des comportements des consommateurs. Il met l\'accent sur l\'analyse des parcours clients.', en: 'Ce module explore l\'exploitation des données dans la compréhension des comportements des consommateurs. Il met l\'accent sur l\'analyse des parcours clients.' },
      },
      {
        code: 'M3',
        title: { fr: 'Branding digital et positionnement de marque', en: 'Branding digital et positionnement de marque' },
        description: { fr: 'Ce séminaire aborde la construction et le pilotage de la marque dans un environnement digital concurrentiel.', en: 'Ce séminaire aborde la construction et le pilotage de la marque dans un environnement digital concurrentiel.' },
      },
      {
        code: 'M4',
        title: { fr: 'Expérience client et stratégies omnicanales', en: 'Expérience client et stratégies omnicanales' },
        description: { fr: 'Ce module met l\'accent sur la conception d\'expériences client fluides et cohérentes à travers les différents points de contact.', en: 'Ce module met l\'accent sur la conception d\'expériences client fluides et cohérentes à travers les différents points de contact.' },
      },
      {
        code: 'M5',
        title: { fr: 'Stratégies de communication digitale intégrée', en: 'Stratégies de communication digitale intégrée' },
        description: { fr: 'Ce séminaire développe une approche globale de la communication digitale. Il traite de la conception de plans de communication et de la gestion des canaux.', en: 'Ce séminaire développe une approche globale de la communication digitale. Il traite de la conception de plans de communication et de la gestion des canaux.' },
      },
      {
        code: 'M6',
        title: { fr: 'Content marketing et storytelling stratégique', en: 'Content marketing et storytelling stratégique' },
        description: { fr: 'Ce module explore la création de contenus à forte valeur ajoutée. Il met en avant les techniques de storytelling, la planification éditoriale et les formats innovants.', en: 'Ce module explore la création de contenus à forte valeur ajoutée. Il met en avant les techniques de storytelling, la planification éditoriale et les formats innovants.' },
      },
      {
        code: 'M7',
        title: { fr: 'Acquisition digitale et performance des canaux', en: 'Acquisition digitale et performance des canaux' },
        description: { fr: 'Ce séminaire porte sur les leviers d\'acquisition de trafic et de visibilité. Il permet de maîtriser les stratégies SEO, SEA et autres outils d\'acquisition.', en: 'Ce séminaire porte sur les leviers d\'acquisition de trafic et de visibilité. Il permet de maîtriser les stratégies SEO, SEA et autres outils d\'acquisition.' },
      },
      {
        code: 'M8',
        title: { fr: 'Influence digitale et stratégies communautaires', en: 'Influence digitale et stratégies communautaires' },
        description: { fr: 'Ce module analyse les dynamiques d\'influence dans les écosystèmes numériques. Il aborde le rôle des influenceurs et la gestion des communautés.', en: 'Ce module analyse les dynamiques d\'influence dans les écosystèmes numériques. Il aborde le rôle des influenceurs et la gestion des communautés.' },
      },
      {
        code: 'M9',
        title: { fr: 'CRM et fidélisation à l\'ère du digital', en: 'CRM et fidélisation à l\'ère du digital' },
        description: { fr: 'Ce séminaire traite de la gestion de la relation client dans une logique à long terme. Il met l\'accent sur les outils CRM et la personnalisation des interactions.', en: 'Ce séminaire traite de la gestion de la relation client dans une logique à long terme. Il met l\'accent sur les outils CRM et la personnalisation des interactions.' },
      },
      {
        code: 'M10',
        title: { fr: 'E-réputation et gestion des risques numériques', en: 'E-réputation et gestion des risques numériques' },
        description: { fr: 'Ce module développe les compétences nécessaires pour surveiller, protéger et valoriser l\'image de marque en ligne.', en: 'Ce module développe les compétences nécessaires pour surveiller, protéger et valoriser l\'image de marque en ligne.' },
      },
      {
        code: 'M11',
        title: { fr: 'Pilotage de la performance marketing', en: 'Pilotage de la performance marketing' },
        description: { fr: 'Ce séminaire est consacré à la mesure et à l\'optimisation des performances digitales. Il permet de définir des KPIs pertinents, et d\'analyser les résultats des campagnes.', en: 'Ce séminaire est consacré à la mesure et à l\'optimisation des performances digitales. Il permet de définir des KPIs pertinents, et d\'analyser les résultats des campagnes.' },
      },
      {
        code: 'M12',
        title: { fr: 'Méthodologie de recherche & mémoire professionnel', en: 'Méthodologie de recherche & mémoire professionnel' },
        description: { fr: 'Ce séminaire accompagne les participants dans la structuration de leur projet ou mémoire. Il vise à mobiliser l\'ensemble des compétences acquises lors des séminaires.', en: 'Ce séminaire accompagne les participants dans la structuration de leur projet ou mémoire. Il vise à mobiliser l\'ensemble des compétences acquises lors des séminaires.' },
      },
    ],
  },
  {
    slug: 'mba-tourisme-hospitality',
    faculty: 'business-school',
    type: 'MBA',
    title: { fr: 'MBA Tourisme & Hospitality Management', en: 'MBA Tourism & Hospitality Management' },
    shortPitch: { fr: 'Ce MBA vise à former des managers capables de piloter des organisations touristiques et hôtelières dans un environnement en mutation, marqué par la digitalisation, les nouvelles attentes des clients et les enjeux de durabilité.', en: 'Ce MBA vise à former des managers capables de piloter des organisations touristiques et hôtelières dans un environnement en mutation, marqué par la digitalisation, les nouvelles attentes des clients et les enjeux de durabilité.' },  // EN translation TBD
    vocation: { fr: 'Ce MBA vise à former des managers capables de piloter des organisations touristiques et hôtelières dans un environnement en mutation, marqué par la digitalisation, les nouvelles attentes des clients et les enjeux de durabilité. Il développe une vision stratégique intégrée du secteur, articulant performance économique, excellence opérationnelle et attractivité territoriale.', en: 'Ce MBA vise à former des managers capables de piloter des organisations touristiques et hôtelières dans un environnement en mutation, marqué par la digitalisation, les nouvelles attentes des clients et les enjeux de durabilité. Il développe une vision stratégique intégrée du secteur, articulant performance économique, excellence opérationnelle et attractivité territoriale.' },
    targetAudience: { fr: 'Ce programme s\'adresse à des profils variés souhaitant évoluer vers des fonctions de management dans le secteur du tourisme et de l\'hospitality. Il cible aussi bien les professionnels de l\'hôtellerie, du tourisme, de la restauration ou de l\'événementiel, que les responsables de structures touristiques, d\'agences de voyages ou d\'institutions territoriales. Il s\'adresse également aux cadres désireux de développer une expertise stratégique sectorielle.', en: 'Ce programme s\'adresse à des profils variés souhaitant évoluer vers des fonctions de management dans le secteur du tourisme et de l\'hospitality. Il cible aussi bien les professionnels de l\'hôtellerie, du tourisme, de la restauration ou de l\'événementiel, que les responsables de structures touristiques, d\'agences de voyages ou d\'institutions territoriales. Il s\'adresse également aux cadres désireux de développer une expertise stratégique sectorielle.' },
    careerOutlooks: { fr: 'Ce MBA ouvre l\'accès à des fonctions de responsabilité dans un secteur en pleine transformation, en permettant aux diplômés d\'évoluer vers des postes tels que directeur d\'établissement hôtelier, de resort ou de structure touristique. Il prépare également aux métiers de responsable du développement touristique ou du marketing territorial, de consultant en stratégie touristique et hôtelière, ainsi que de manager d\'activités événementielles ou de tourisme d\'affaires (MICE).', en: 'Ce MBA ouvre l\'accès à des fonctions de responsabilité dans un secteur en pleine transformation, en permettant aux diplômés d\'évoluer vers des postes tels que directeur d\'établissement hôtelier, de resort ou de structure touristique. Il prépare également aux métiers de responsable du développement touristique ou du marketing territorial, de consultant en stratégie touristique et hôtelière, ainsi que de manager d\'activités événementielles ou de tourisme d\'affaires (MICE).' },
    skillsNarrative: { fr: 'À l\'issue du programme, les participants seront en mesure de concevoir et piloter des stratégies de développement touristique et hôtelier, tout en optimisant la performance des établissements à travers une approche intégrée des dimensions financières, marketing et opérationnelles. Ils développeront leur capacité à créer des expériences client innovantes et différenciantes, à intégrer efficacement les outils digitaux dans la gestion et la promotion des activités touristiques.', en: 'À l\'issue du programme, les participants seront en mesure de concevoir et piloter des stratégies de développement touristique et hôtelier, tout en optimisant la performance des établissements à travers une approche intégrée des dimensions financières, marketing et opérationnelles. Ils développeront leur capacité à créer des expériences client innovantes et différenciantes, à intégrer efficacement les outils digitaux dans la gestion et la promotion des activités touristiques.' },
    objectives: [
      { fr: 'Piloter des organisations touristiques et hôtelières en intégrant les enjeux de performance et de qualité de service.', en: 'Piloter des organisations touristiques et hôtelières en intégrant les enjeux de performance et de qualité de service.' },
      { fr: 'Concevoir des stratégies innovantes adaptées aux évolutions du secteur et aux nouvelles attentes des clients.', en: 'Concevoir des stratégies innovantes adaptées aux évolutions du secteur et aux nouvelles attentes des clients.' },
      { fr: 'Développer et optimiser l\'expérience client dans une logique de différenciation et de fidélisation.', en: 'Développer et optimiser l\'expérience client dans une logique de différenciation et de fidélisation.' },
      { fr: 'Intégrer les outils digitaux et les technologies innovantes dans la gestion et la promotion des services touristiques.', en: 'Intégrer les outils digitaux et les technologies innovantes dans la gestion et la promotion des services touristiques.' },
    ],
    duration: '12 mois',
    format: 'Distanciel',
    bacLevel: 'Bac +3',
    schedule: { fr: 'En ligne / 100 % digital', en: 'Online — 100 % digital' },
    admission: { fr: 'La sélection repose sur l’étude du dossier académique et professionnel, complétée d’un entretien.', en: 'Admission is based on a review of the academic and professional file, followed by an interview.' },
    isFeatured: false,
    curriculum: [
      {
        code: 'M1',
        title: { fr: 'Dynamiques globales et mutations du secteur touristique', en: 'Dynamiques globales et mutations du secteur touristique' },
        description: { fr: 'Ce module introduit les grandes transformations du tourisme à l\'échelle internationale. Il permet de comprendre les évolutions géopolitiques et économiques.', en: 'Ce module introduit les grandes transformations du tourisme à l\'échelle internationale. Il permet de comprendre les évolutions géopolitiques et économiques.' },
      },
      {
        code: 'M2',
        title: { fr: 'Stratégies de développement des organisations touristiques', en: 'Stratégies de développement des organisations touristiques' },
        description: { fr: 'Ce module aborde les principes du management stratégique appliqués au tourisme et à l\'hospitality. Il permet d\'analyser les modèles économiques du secteur.', en: 'Ce module aborde les principes du management stratégique appliqués au tourisme et à l\'hospitality. Il permet d\'analyser les modèles économiques du secteur.' },
      },
      {
        code: 'M3',
        title: { fr: 'Marketing touristique et création d\'expérience-client', en: 'Marketing touristique et création d\'expérience-client' },
        description: { fr: 'Ce séminaire met l\'accent sur les nouvelles approches du marketing touristique, centrées sur l\'expérience client.', en: 'Ce séminaire met l\'accent sur les nouvelles approches du marketing touristique, centrées sur l\'expérience client.' },
      },
      {
        code: 'M4',
        title: { fr: 'Digitalisation du tourisme et leviers du e-tourisme', en: 'Digitalisation du tourisme et leviers du e-tourisme' },
        description: { fr: 'Ce module explore l\'impact des technologies digitales sur le secteur touristique. Il aborde les outils de visibilité en ligne et la gestion de la e-réputation.', en: 'Ce module explore l\'impact des technologies digitales sur le secteur touristique. Il aborde les outils de visibilité en ligne et la gestion de la e-réputation.' },
      },
      {
        code: 'M5',
        title: { fr: 'Pilotage opérationnel des établissements hôteliers', en: 'Pilotage opérationnel des établissements hôteliers' },
        description: { fr: 'Ce séminaire développe les compétences nécessaires à la gestion quotidienne des établissements hôteliers. Il traite de l\'organisation et de la qualité de service.', en: 'Ce séminaire développe les compétences nécessaires à la gestion quotidienne des établissements hôteliers. Il traite de l\'organisation et de la qualité de service.' },
      },
      {
        code: 'M6',
        title: { fr: 'Gestion financière et performance dans l\'hospitality', en: 'Gestion financière et performance dans l\'hospitality' },
        description: { fr: 'Ce module permet de maîtriser les outils financiers propres au secteur hôtelier. Il aborde l\'analyse des coûts, les indicateurs de performance et de pilotage.', en: 'Ce module permet de maîtriser les outils financiers propres au secteur hôtelier. Il aborde l\'analyse des coûts, les indicateurs de performance et de pilotage.' },
      },
      {
        code: 'M7',
        title: { fr: 'Management des talents et des équipes dans le tourisme', en: 'Management des talents et des équipes dans le tourisme' },
        description: { fr: 'Ce séminaire traite de la gestion des ressources humaines dans un secteur fortement orienté service. Il met l\'accent sur le recrutement et la motivation du personnel.', en: 'Ce séminaire traite de la gestion des ressources humaines dans un secteur fortement orienté service. Il met l\'accent sur le recrutement et la motivation du personnel.' },
      },
      {
        code: 'M8',
        title: { fr: 'Innovation et transition vers un tourisme durable', en: 'Innovation et transition vers un tourisme durable' },
        description: { fr: 'Ce module met en lumière les nouvelles tendances en matière d\'innovation et de développement durable. Il aborde les modèles alternatifs (écotourisme, slow tourisme).', en: 'Ce module met en lumière les nouvelles tendances en matière d\'innovation et de développement durable. Il aborde les modèles alternatifs (écotourisme, slow tourisme).' },
      },
      {
        code: 'M9',
        title: { fr: 'Gouvernance des destinations et attractivité territoriale', en: 'Gouvernance des destinations et attractivité territoriale' },
        description: { fr: 'Ce séminaire explore les mécanismes de gestion des destinations touristiques. Il permet de comprendre les dynamiques territoriales et les partenariats public-privé.', en: 'Ce séminaire explore les mécanismes de gestion des destinations touristiques. Il permet de comprendre les dynamiques territoriales et les partenariats public-privé.' },
      },
      {
        code: 'M10',
        title: { fr: 'Management de l\'événementiel et tourisme d\'affaires', en: 'Management de l\'événementiel et tourisme d\'affaires' },
        description: { fr: 'Ce module traite de l\'organisation d\'événements professionnels et touristiques. Il aborde la planification, la logistique et la coordination des acteurs.', en: 'Ce module traite de l\'organisation d\'événements professionnels et touristiques. Il aborde la planification, la logistique et la coordination des acteurs.' },
      },
      {
        code: 'M11',
        title: { fr: 'Tendances émergentes et prospective du secteur', en: 'Tendances émergentes et prospective du secteur' },
        description: { fr: 'Ce séminaire analyse les évolutions futures, notamment les nouvelles formes d\'hébergement, les technologies immersives et les transformations des attentes clients.', en: 'Ce séminaire analyse les évolutions futures, notamment les nouvelles formes d\'hébergement, les technologies immersives et les transformations des attentes clients.' },
      },
      {
        code: 'M12',
        title: { fr: 'Méthodologie de recherche et mémoire professionnel', en: 'Méthodologie de recherche et mémoire professionnel' },
        description: { fr: 'Ce module accompagne les participants dans la réalisation de leur mémoire professionnel. Il aborde la construction de la problématique et les méthodes d\'analyse.', en: 'Ce module accompagne les participants dans la réalisation de leur mémoire professionnel. Il aborde la construction de la problématique et les méthodes d\'analyse.' },
      },
    ],
  },
];

async function run() {
  await payload.init({ secret: process.env.PAYLOAD_SECRET!, local: true });
  payload.logger.info('Seeding real UNM × EBS content…');

  const logoPath = path.resolve(__dirname, '../../../logo-UNM.jpeg');
  const placeholderMedia = await payload.create({
    collection: 'media',
    data: { alt: 'UNM' },
    filePath: logoPath,
  });

  const facultyMap: Record<string, string | number> = {};
  for (const f of FACULTIES) {
    const created = await payload.create({
      collection: 'faculties',
      data: {
        slug: f.slug,
        displayOrder: f.displayOrder,
        name: f.name,
        description: f.description,
        icon: f.icon,
        color: f.color,
        comingSoon: !!f.comingSoon,
        outcomes: f.outcomes.map((o) => ({ text: o })),
        strengths: f.strengths.map((s) => ({ text: s })),
        domains: (f.domains ?? []).map((d) => ({ name: d })),
        coverImage: placeholderMedia.id,
        metaTitle: { fr: f.name.fr + ' | UNM', en: f.name.en + ' | UNM' },
        metaDescription: f.description,
      },
    });
    facultyMap[f.slug] = created.id;
  }

  for (const p of PROGRAMS) {
    // Some programmes (e.g. the DBA) only expose objectives + curriculum
    // in their brochure — no public-cible / débouchés / compétences sections.
    // Pad with safe defaults so CMS validation passes; the editorial template
    // simply hides empty sections.
    const nonEmpty = (n: { fr: string; en: string }, fallback: { fr: string; en: string }) =>
      n && n.fr && n.fr.trim() ? n : fallback;
    const safeAudience = nonEmpty(p.targetAudience, {
      fr: 'Programme dédié aux cadres dirigeants et professionnels souhaitant structurer une démarche stratégique de haut niveau.',
      en: 'Programme for senior executives and professionals seeking to structure a high-level strategic approach.',
    });
    const safeSkills = nonEmpty(p.skillsNarrative, p.vocation);
    const safeOutcomes = nonEmpty(p.careerOutlooks, {
      fr: 'Évolution vers les plus hautes responsabilités, reconnaissance académique internationale.',
      en: 'Progression to top leadership roles, international academic recognition.',
    });
    const bulletFromNarrative = (n: { fr: string; en: string }) => [{ text: n }];
    await payload.create({
      collection: 'programs',
      data: {
        slug: p.slug,
        title: p.title,
        type: p.type,
        faculty: facultyMap[p.faculty] as any,
        duration: p.duration,
        format: p.format,
        language: ['fr', 'en'],
        schedule: p.schedule,
        admissionRequirements: { fr: `${p.bacLevel}. ${p.admission.fr}`, en: `${p.bacLevel}. ${p.admission.en}` },
        vocation: p.vocation,
        targetAudience: safeAudience,
        objectives: p.objectives.map((o) => ({ text: o })),
        skills: bulletFromNarrative(safeSkills),
        outcomes: bulletFromNarrative(safeOutcomes),
        skillsNarrative: safeSkills,
        careerOutlooks: safeOutcomes,
        curriculum: p.curriculum.map((m) => ({
          code: m.code,
          title: m.title,
          description: m.description,
          ...(m.group ? { group: m.group.fr } : {}),
        })),
        tuitionFee: p.tuitionFee ?? null,
        faq: [
          {
            question: { fr: 'Quelle est la durée du programme ?', en: 'How long is the programme?' },
            answer: { fr: p.duration + '.', en: p.duration + '.' },
          },
          {
            question: { fr: 'Quel diplôme est délivré ?', en: 'What diploma is awarded?' },
            answer: {
              fr: "Le diplôme est délivré par European Business School (EBS Paris) en partenariat avec l'Université Numérique du Maroc.",
              en: 'The diploma is awarded by European Business School (EBS Paris) in partnership with the Digital University of Morocco.',
            },
          },
          {
            question: { fr: 'Quel est le rythme de la formation ?', en: 'What is the programme rhythm?' },
            answer: { fr: p.schedule.fr, en: p.schedule.en },
          },
          {
            question: { fr: 'Comment se déroule l’admission ?', en: 'How does admission work?' },
            answer: p.admission,
          },
        ],
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120),
        isActive: true,
        isFeatured: p.isFeatured,
        metaTitle: { fr: p.title.fr + ' | UNM', en: p.title.en + ' | UNM' },
        metaDescription: p.shortPitch,
      },
    });
  }

  // Testimonials
  const testimonials = [
    {
      quote: { fr: "Le MBA UNM × EBS m'a donné une vision stratégique nouvelle pour mon entreprise.", en: 'The UNM × EBS MBA gave me a fresh strategic vision for my company.' },
      role: { fr: 'Directeur Général, Casablanca', en: 'CEO, Casablanca' },
    },
    {
      quote: { fr: 'Une pédagogie orientée action, ancrée dans les réalités africaines.', en: 'Action-oriented pedagogy, anchored in African realities.' },
      role: { fr: 'Cadre supérieur, Ministère des Mines', en: 'Senior Official, Ministry of Mines' },
    },
    {
      quote: { fr: "Le DBA a transformé mon expérience professionnelle en levier d'innovation.", en: 'The DBA turned my professional experience into an innovation lever.' },
      role: { fr: 'Consultant senior, Rabat', en: 'Senior Consultant, Rabat' },
    },
    {
      quote: { fr: 'Un standard international, une réelle reconnaissance académique.', en: 'International standards and real academic recognition.' },
      role: { fr: 'Diplômée DBA, Dakar', en: 'DBA Graduate, Dakar' },
    },
    {
      quote: { fr: "L'accompagnement individuel a fait toute la différence.", en: 'The one-to-one mentoring made all the difference.' },
      role: { fr: 'Directeur stratégie, Abidjan', en: 'Strategy Director, Abidjan' },
    },
  ];
  for (const [i, t] of testimonials.entries()) {
    await payload.create({
      collection: 'testimonials',
      data: {
        quote: t.quote,
        authorName: ['L. Benali', 'F. Sissoko', 'A. Diallo', 'K. Touré', 'M. El Amrani'][i],
        authorRole: t.role,
      },
    });
  }

  // Partners — real logos from apps/web/public/LOGS
  const partnersDir = path.resolve(__dirname, '../../web/public/LOGS');
  const partners = [
    { name: 'European Business School (EBS Paris)', category: 'academic' as const, file: 'EBS.jpeg' },
    { name: 'EFMD', category: 'academic' as const, file: 'EFMD.jpeg' },
    { name: 'AACSB Business Education Alliance', category: 'academic' as const, file: 'aac.jpeg' },
    { name: 'CEFDG', category: 'academic' as const, file: 'cef.jpeg' },
    { name: 'Ministère des Mines (Maroc)', category: 'government' as const, file: 'minstry.jpeg' },
    { name: 'OCP Group', category: 'industry' as const, file: 'ocp.jpeg' },
    { name: 'Confédération Générale des Entreprises du Maroc', category: 'industry' as const, file: 'cgem.jpeg' },
    { name: 'Bank Al-Maghrib', category: 'government' as const, file: 'bankmagreb.jpeg' },
  ];
  for (const p of partners) {
    const logoPath = path.join(partnersDir, p.file);
    const logoMedia = await payload.create({
      collection: 'media',
      data: { alt: p.name },
      filePath: logoPath,
    });
    await payload.create({
      collection: 'partners',
      data: { name: p.name, logo: logoMedia.id, category: p.category },
    });
  }

  // Articles
  const articles = [
    {
      slug: 'lancement-partenariat-unm-ebs',
      title: { fr: 'Lancement du partenariat UNM × EBS Paris', en: 'Launch of the UNM × EBS Paris partnership' },
      excerpt: {
        fr: "L'Université Numérique du Maroc et European Business School Paris officialisent une alliance académique pour le leadership africain.",
        en: 'The Digital University of Morocco and European Business School Paris launch an academic alliance for African leadership.',
      },
      body: {
        fr: "<p>L'UNM et EBS Paris s'associent pour créer un écosystème de formation et de recherche à fort impact, ancré dans les réalités africaines et ouvert sur le monde. Ce partenariat couvre l'ensemble de l'offre Executive : DBA, MBA sectoriels et certificats.</p>",
        en: '<p>UNM and EBS Paris team up to create a high-impact training and research ecosystem, anchored in African realities and open to the world. This partnership covers the entire Executive offering: DBA, sectoral MBAs and certificates.</p>',
      },
    },
    {
      slug: 'mba-ressources-minieres-ouverture',
      title: { fr: 'Ouverture du MBA Ressources Minières', en: 'New MBA in Mining Resources opens' },
      excerpt: {
        fr: 'Un programme phare pour former les dirigeants du secteur extractif africain.',
        en: 'A flagship programme to train leaders of the African extractive sector.',
      },
      body: {
        fr: "<p>L'UNM lance le MBA Gouvernance Stratégique & Valorisation des Ressources Minières, construit autour de 12 séminaires alliant géopolitique, droit, finance et ESG.</p>",
        en: '<p>UNM launches the MBA in Strategic Governance & Valorisation of Mining Resources, built around 12 seminars covering geopolitics, law, finance and ESG.</p>',
      },
    },
    {
      slug: 'campus-marrakech-laayoune',
      title: { fr: 'Deux campus : Marrakech et Laâyoune', en: 'Two campuses: Marrakech and Laâyoune' },
      excerpt: {
        fr: "L'UNM s'implante au cœur du Maroc avec deux campus dédiés à la formation Executive.",
        en: 'UNM grows in Morocco with two campuses dedicated to executive education.',
      },
      body: {
        fr: '<p>Le campus de Marrakech (Borj Menara I) et le campus de Laâyoune (N°8, Al Bouchra, Av. Alfourssane) accueillent les sessions présentielles et les soutenances.</p>',
        en: '<p>The Marrakech campus (Borj Menara I) and the Laâyoune campus (N°8, Al Bouchra, Av. Alfourssane) host in-person sessions and defences.</p>',
      },
    },
  ];
  const articleMeta: { category: 'campus' | 'recherche' | 'partenariats' | 'evenements'; daysAgo: number }[] = [
    { category: 'partenariats', daysAgo: 2 },
    { category: 'recherche', daysAgo: 14 },
    { category: 'campus', daysAgo: 28 },
  ];
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const meta = articleMeta[i] ?? { category: 'campus' as const, daysAgo: 7 };
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - meta.daysAgo);
    await payload.create({
      collection: 'articles',
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        coverImage: placeholderMedia.id,
        author: { name: 'Rédaction UNM' },
        category: meta.category,
        publishedAt,
        readingTime: 3,
        metaTitle: a.title,
        metaDescription: a.excerpt,
      },
    });
  }

  // SiteSettings global
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      contact: {
        phone: '+212 6 62 62 62 19',
        whatsapp: '+212 6 62 62 62 19',
        email: 'contact@unm.ma',
        address: {
          fr: 'Campus Marrakech — Borj Menara I, Av. Abdelkrim El Khattabi · Campus Laâyoune — N°8, Al Bouchra, Av. Alfourssane',
          en: 'Marrakech Campus — Borj Menara I, Av. Abdelkrim El Khattabi · Laâyoune Campus — N°8, Al Bouchra, Av. Alfourssane',
        },
      },
      social: { linkedin: 'https://www.linkedin.com/school/unm-ma' },
      legal: {
        legalNotice: { fr: '', en: '' },
        privacyPolicy: { fr: '', en: '' },
      },
    },
  });

  const password = crypto.randomBytes(12).toString('hex');
  await payload.create({
    collection: 'users',
    data: {
      email: 'superadmin@unm.ma',
      password,
      name: 'Super Admin',
      role: 'admin',
    },
  });
  payload.logger.info(`Superadmin — superadmin@unm.ma / ${password}`);
  payload.logger.info('Seed complete.');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
