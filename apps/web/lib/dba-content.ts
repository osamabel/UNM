// ════════════════════════════════════════════════════════════════
// DBA UNM × EBS — single source of truth for the /dba page.
// All copy lives here; the section components consume it via props
// or by importing `dbaContent` directly. No hard-coded strings in
// the React components.
// ════════════════════════════════════════════════════════════════

import type { LocalizedField } from '@unm/types';

const t = (fr: string, en: string): LocalizedField => ({ fr, en });

export interface DBAObjective {
  index: number;
  title: LocalizedField;
}

export interface DBASeminar {
  index: number;
  title: LocalizedField;
}

export interface DBAFacultyPillar {
  title: LocalizedField;
  body: LocalizedField;
}

export interface DBAAccreditation {
  label: string;
  full: LocalizedField;
  slug: string;
}

export interface DBAContent {
  meta: {
    title: LocalizedField;
    description: LocalizedField;
    canonicalPath: { fr: string; en: string };
  };
  hero: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    tagline: LocalizedField;
    pitch: LocalizedField;
    ctas: {
      primary: { label: LocalizedField; href: string };
      secondary: { label: LocalizedField; href: string };
    };
    logosAriaLabel: LocalizedField;
  };
  partner: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    paragraphs: LocalizedField[];
    pullquote: LocalizedField;
    history: { title: LocalizedField; body: LocalizedField };
  };
  programme: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    paragraphs: LocalizedField[];
    baseline: LocalizedField;
    partnership: {
      title: LocalizedField;
      paragraphs: LocalizedField[];
    };
  };
  objectives: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    items: DBAObjective[];
    centralQuote: LocalizedField;
  };
  keyInfo: {
    title: LocalizedField;
    items: { label: LocalizedField; value: LocalizedField }[];
  };
  pedagogy: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    intro: LocalizedField;
    year1: { label: LocalizedField; seminars: DBASeminar[] };
    year2: { label: LocalizedField; seminars: DBASeminar[] };
    defence: LocalizedField;
    sideCallout: LocalizedField;
  };
  faculty: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    intro: LocalizedField;
    pillars: DBAFacultyPillar[];
  };
  accreditations: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    intro: LocalizedField;
    items: DBAAccreditation[];
    finalCallout: { title: LocalizedField; body: LocalizedField };
  };
  contact: {
    eyebrow: LocalizedField;
    title: LocalizedField;
    handle: string;
    phone: string;
    site: { label: string; href: string };
    campuses: {
      name: string;
      address: LocalizedField;
    }[];
  };
}

export const dbaContent: DBAContent = {
  meta: {
    title: t(
      'DBA — Doctorate in Business Administration | UNM × EBS Paris',
      'DBA — Doctorate in Business Administration | UNM × EBS Paris',
    ),
    description: t(
      "Décrochez un Doctorat en Administration des Affaires (Bac+8) délivré par European Business School en partenariat avec l'Université Numérique du Maroc. Programme hybride sur 2 ans, soutenance à Paris.",
      'Earn a Doctorate in Business Administration (Bac+8) awarded by European Business School in partnership with the Digital University of Morocco. Hybrid programme over 2 years with a defence in Paris.',
    ),
    canonicalPath: { fr: '/dba', en: '/en/dba' },
  },

  hero: {
    eyebrow: t('DBA · UNM × EBS Paris', 'DBA · UNM × EBS Paris'),
    title: t('Doctorate in Business Administration', 'Doctorate in Business Administration'),
    tagline: t('Le doctorat des dirigeants', 'The doctorate for senior leaders'),
    pitch: t(
      "Accédez au titre de Docteur (Dr.) en Administration des affaires délivré par European Business School en partenariat avec l'Université Numérique du Maroc.",
      'Earn the title of Doctor (Dr.) of Business Administration awarded by European Business School in partnership with the Digital University of Morocco.',
    ),
    ctas: {
      primary: { label: t('Candidater', 'Apply'), href: '/admissions?program=dba-business-administration' },
      secondary: { label: t('Télécharger la brochure', 'Download the brochure'), href: '#contact' },
    },
    logosAriaLabel: t('Partenaires et accréditations', 'Partners and accreditations'),
  },

  partner: {
    eyebrow: t('Notre partenaire', 'Our partner'),
    title: t('European Business School', 'European Business School'),
    paragraphs: [
      t(
        "EBS est une grande école de management parisienne à dimension européenne (Paris, Dublin, Barcelone), reconnue pour sa taille humaine et son approche personnalisée. Elle privilégie une pédagogie de proximité, plaçant l'apprenant au cœur de son parcours, à travers une démarche fondée sur l'action et l'expérience.",
        'EBS is a Paris-based business school with a European footprint (Paris, Dublin, Barcelona), recognised for its human scale and personalised approach. Its pedagogy places the learner at the centre, through a path rooted in action and experience.',
      ),
      t(
        'European Business School forme des business developers capables de créer, de transformer et de piloter le développement des organisations dans un environnement global en constante évolution.',
        'EBS trains business developers able to create, transform and drive growth in organisations operating in a constantly evolving global environment.',
      ),
      t(
        'EBS propose un encadrement à la fois bienveillant et structurant, porté par des équipes pédagogiques et administratives engagées.',
        'EBS offers mentorship that is both supportive and rigorous, delivered by committed academic and administrative teams.',
      ),
    ],
    pullquote: t(
      "EBS vise à faire vivre ses valeurs d'audace, d'humanisme et d'engagement.",
      'EBS strives to bring its values of boldness, humanism and commitment to life.',
    ),
    history: {
      title: t('Une école pionnière depuis 1967', 'A pioneering school since 1967'),
      body: t(
        "EBS Paris est dès sa création en 1967 considérée comme une école révolutionnaire. Son fondateur, Philippe Guilhaume, affiche une volonté très nette de développer la première Business School européenne.",
        "Founded in 1967, EBS Paris has been considered a revolutionary school from the start. Its founder, Philippe Guilhaume, set out to build the first truly European Business School.",
      ),
    },
  },

  programme: {
    eyebrow: t('Notre programme', 'Our programme'),
    title: t('Université Numérique du Maroc', 'Digital University of Morocco'),
    paragraphs: [
      t(
        "L'Université Numérique du Maroc est un établissement d'enseignement supérieur dédié à la formation exécutive, avec une vocation résolument tournée vers l'Afrique et ses dynamiques de transformation.",
        'The Digital University of Morocco is a higher-education institution dedicated to executive education, with a vocation resolutely turned toward Africa and its transformation dynamics.',
      ),
      t(
        "À travers une offre académique structurée autour de la formation Executive, l'université accompagne les cadres, dirigeants et futurs leaders dans le développement de compétences stratégiques, managériales et décisionnelles adaptées aux réalités africaines.",
        'Through an academic offering built around executive education, the university supports executives, leaders and future leaders in developing the strategic, managerial and decision-making skills required by African realities.',
      ),
      t(
        "Positionnée au croisement de l'excellence académique et des enjeux opérationnels, l'Université Numérique du Maroc privilégie une approche orientée vers l'action, intégrant études de cas africains, retours d'expérience terrain et ouverture internationale.",
        'Positioned at the intersection of academic excellence and operational stakes, UNM favours an action-oriented approach, integrating African case studies, field experience and international openness.',
      ),
      t(
        "Engagée dans la formation d'une nouvelle génération de décideurs, elle contribue activement à l'émergence d'un leadership africain innovant, responsable et capable de relever les défis économiques, sociaux et technologiques du continent.",
        'Committed to training a new generation of decision-makers, UNM actively contributes to the emergence of an innovative, responsible African leadership able to take on the continent’s economic, social and technological challenges.',
      ),
    ],
    baseline: t(
      "Le doctorat des leaders qui transforment l'Afrique.",
      'The doctorate for the leaders who transform Africa.',
    ),
    partnership: {
      title: t("Un partenariat à forte valeur ajoutée", 'A high-value partnership'),
      paragraphs: [
        t(
          "Le partenariat entre l'Université Numérique du Maroc et European Business School s'inscrit dans une dynamique d'ouverture internationale et d'excellence académique.",
          'The partnership between the Digital University of Morocco and European Business School is rooted in international openness and academic excellence.',
        ),
        t(
          "À travers cette collaboration, l'UNM renforce son ambition de proposer en Afrique des parcours doctoraux à forte valeur ajoutée, articulant rigueur académique et impact opérationnel. Ce partenariat permet aux participants du DBA de bénéficier d'une double expertise, à la croisée des réalités africaines et des standards internationaux.",
          'Through this collaboration, UNM reinforces its ambition to offer high-value doctoral programmes in Africa, combining academic rigour with operational impact. DBA participants benefit from dual expertise, at the intersection of African realities and international standards.',
        ),
      ],
    },
  },

  objectives: {
    eyebrow: t('Objectifs', 'Objectives'),
    title: t('Les objectifs du doctorat', 'Objectives of the doctorate'),
    items: [
      {
        index: 1,
        title: t(
          "Former des leaders capables de produire une recherche appliquée à fort impact, en mobilisant des cadres théoriques rigoureux.",
          'Train leaders able to produce high-impact applied research, drawing on rigorous theoretical frameworks.',
        ),
      },
      {
        index: 2,
        title: t(
          "Développer une pensée stratégique et une capacité de transformation, permettant aux dirigeants de piloter le changement et d'innover.",
          'Develop strategic thinking and the ability to transform, enabling leaders to drive change and innovate.',
        ),
      },
    ],
    centralQuote: t(
      "Bien plus qu'un diplôme, le DBA est une expérience de transformation intellectuelle et stratégique au service de l'impact.",
      'More than a degree, the DBA is an intellectual and strategic transformation experience designed for impact.',
    ),
  },

  keyInfo: {
    title: t('Fiche programme', 'Programme at a glance'),
    items: [
      { label: t('Rythme', 'Format'), value: t('Hybride', 'Hybrid') },
      { label: t('Durée', 'Duration'), value: t('2 ans', '2 years') },
      { label: t("Conditions d'accès", 'Prerequisites'), value: t('Bac+5', "Master's degree") },
      { label: t('Diplôme', 'Degree'), value: t('Doctorat (Bac+8)', 'Doctorate (Bac+8)') },
      { label: t('Soutenance', 'Defence'), value: t('EBS Paris / En ligne', 'EBS Paris / Online') },
      { label: t('Encadrement', 'Mentoring'), value: t('Individuel & régulier', 'One-to-one & regular') },
    ],
  },

  pedagogy: {
    eyebrow: t('Contenu pédagogique', 'Curriculum'),
    title: t('Un parcours en deux années', 'A two-year journey'),
    intro: t(
      "Le programme est structuré sur 2 années, combinant des séminaires académiques de haut niveau et un accompagnement progressif vers la production d'une thèse à fort impact managérial.",
      'The programme is built over 2 years, combining high-level academic seminars with progressive guidance toward the production of a managerially impactful thesis.',
    ),
    year1: {
      label: t('Première année', 'Year 1'),
      seminars: [
        { index: 1, title: t("Fondamentaux d'un DBA", 'DBA Fundamentals') },
        { index: 2, title: t('Revue de littérature & Design de la Recherche', 'Literature Review & Research Design') },
        { index: 3, title: t('Méthodologies Qualitatives', 'Qualitative Methodologies') },
        { index: 4, title: t('Méthodologies Quantitatives', 'Quantitative Methodologies') },
      ],
    },
    year2: {
      label: t('Deuxième année', 'Year 2'),
      seminars: [
        { index: 5, title: t('IA et Stratégie de Recherche Documentaire', 'AI & Documentary Research Strategy') },
        { index: 6, title: t('Analyse Qualitative Approfondie', 'In-depth Qualitative Analysis') },
        { index: 7, title: t('Analyse avancée et Production de Résultats à impact managérial', 'Advanced Analysis & Managerial-Impact Findings') },
        { index: 8, title: t('Rédaction finale, valorisation et soutenance', 'Final Writing, Valorisation & Defence') },
      ],
    },
    defence: t(
      'Soutenance de Thèse DBA — EBS Paris (France) ou en ligne',
      'DBA Thesis Defence — EBS Paris (France) or online',
    ),
    sideCallout: t(
      "Le Doctorate in Business Administration (DBA) est un programme d'excellence conçu pour les cadres et dirigeants souhaitant prendre du recul sur leurs pratiques et développer une capacité d'analyse stratégique fondée sur la recherche.",
      'The Doctorate in Business Administration (DBA) is an excellence programme designed for executives and leaders who want to step back from their practice and build research-based strategic analysis capability.',
    ),
  },

  faculty: {
    eyebrow: t('Corps professoral', 'Faculty'),
    title: t('Nos intervenants', 'Our faculty'),
    intro: t(
      "Le programme DBA s'appuie sur l'intervention d'un corps professoral international composé d'enseignants-chercheurs et d'experts de haut niveau, reconnus pour leurs travaux scientifiques et leur expérience opérationnelle. Cette diversité de profils permet d'offrir aux participants une approche à la fois académique, stratégique et ancrée dans les réalités des organisations, notamment dans le contexte africain.",
      'The DBA draws on an international faculty of professors and senior experts recognised for their scientific work and operational experience. This diversity of profiles provides participants with an approach that is academic, strategic and grounded in organisational realities, particularly in the African context.',
    ),
    pillars: [
      {
        title: t('Excellence académique', 'Academic excellence'),
        body: t(
          "Un corps professoral composé d'enseignants-chercheurs reconnus, garantissant une formation rigoureuse.",
          'A faculty of recognised professors and researchers, ensuring rigorous training.',
        ),
      },
      {
        title: t('Expertise terrain confirmée', 'Proven field expertise'),
        body: t(
          'Des intervenants disposant d’une solide expérience professionnelle, reliant les concepts théoriques aux réalités concrètes.',
          'Lecturers with solid professional experience, connecting theoretical concepts to real-world realities.',
        ),
      },
      {
        title: t('Accompagnement personnalisé', 'Personalised mentoring'),
        body: t(
          'Un suivi individualisé tout au long du parcours doctoral, favorisant la maturation du projet de recherche.',
          'One-to-one mentoring throughout the doctoral journey, helping the research project mature.',
        ),
      },
    ],
  },

  accreditations: {
    eyebrow: t('Accréditations', 'Accreditations'),
    title: t("Reconnaissance internationale", 'International recognition'),
    intro: t(
      "Notre programme s'inscrit dans un environnement académique d'excellence, en partenariat avec des institutions reconnues au niveau international. Il s'appuie sur des standards de qualité rigoureux, garantissant une formation conforme aux exigences des grandes écoles de management et aux meilleures pratiques en matière de recherche et de formation doctorale. Cette reconnaissance institutionnelle constitue un gage de crédibilité et de qualité.",
      'Our programme is part of an academic environment of excellence, in partnership with institutions recognised internationally. It is built on rigorous quality standards, ensuring a training compliant with the requirements of top business schools and best practices in doctoral research and education. This institutional recognition is a guarantee of credibility and quality.',
    ),
    items: [
      { label: 'CEFDG', slug: 'cefdg', full: t("Commission d'Évaluation des Formations et Diplômes de Gestion", 'French Commission for the Evaluation of Management Degrees') },
      { label: 'CDEFM', slug: 'cdefm', full: t('Conférence des Directeurs des Écoles Françaises de Management', 'Conference of Directors of French Management Schools') },
      { label: 'CGE', slug: 'cge', full: t('Conférence des Grandes Écoles', 'Conference of Grandes Écoles') },
      { label: 'AACSB', slug: 'aacsb', full: t('AACSB Business Education Alliance — Member', 'AACSB Business Education Alliance — Member') },
      { label: 'EFMD', slug: 'efmd', full: t('EFMD Accredited', 'EFMD Accredited') },
    ],
    finalCallout: {
      title: t(
        "Un doctorat au service du leadership stratégique et de l'impact",
        'A doctorate at the service of strategic leadership and impact',
      ),
      body: t(
        "Le DBA s'adresse aux cadres et dirigeants souhaitant franchir un cap dans leur développement professionnel en renforçant leur capacité d'analyse et de prise de décision. À la croisée de la recherche et de l'action, le programme permet de structurer une réflexion stratégique approfondie et de produire des connaissances à forte valeur ajoutée.",
        'The DBA is designed for executives and leaders who want to take a leap in their professional development by strengthening their analysis and decision-making capability. At the intersection of research and action, the programme structures deep strategic thinking and produces high-value knowledge.',
      ),
    },
  },

  contact: {
    eyebrow: t('Contact', 'Contact'),
    title: t('Parlons de votre projet doctoral', 'Let’s talk about your doctoral project'),
    handle: '@UNMaroc',
    phone: '+212 6 62 62 62 19',
    site: { label: 'www.unm.ma', href: 'https://www.unm.ma' },
    campuses: [
      {
        name: 'Marrakech',
        address: t('Borj Menara I, Av. Abdelkrim El Khattabi, Marrakech, Maroc', 'Borj Menara I, Av. Abdelkrim El Khattabi, Marrakech, Morocco'),
      },
      {
        name: 'Laâyoune',
        address: t('N°8, Al Bouchra, Av. Alfourssane, Laâyoune, Maroc', 'N°8, Al Bouchra, Av. Alfourssane, Laâyoune, Morocco'),
      },
    ],
  },
};
