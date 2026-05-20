import type { LegalDocument } from './types';

const t = (fr: string, en: string) => ({ fr, en });

export const cgu: LegalDocument = {
  key: 'cgu',
  href: { fr: '/cgu', en: '/en/terms-of-use' },
  shortLabel: t("Conditions d'utilisation", 'Terms of Use'),
  title: t("Conditions générales d'utilisation", 'Terms of Use'),
  metaTitle: t(
    "Conditions générales d'utilisation | Université Numérique du Maroc",
    'Terms of Use | Université Numérique du Maroc',
  ),
  metaDescription: t(
    "Conditions générales d'utilisation du site et des services en ligne de l'UNM : compte, charte de bonne conduite, propriété intellectuelle, disponibilité et résiliation.",
    "General terms of use of UNM's website and online services: accounts, code of conduct, intellectual property, availability and termination.",
  ),
  lastUpdated: '2026-05-17',
  intro: t(
    "Les présentes Conditions Générales d'Utilisation définissent les modalités d'accès et d'usage du site officiel de l'Université Numérique du Maroc et de ses services en ligne. Elles s'appliquent à tout visiteur, candidat, participant et utilisateur des plateformes numériques de l'UNM.",
    "These Terms of Use set out the conditions for accessing and using the official website of Université Numérique du Maroc and its online services. They apply to any visitor, applicant, participant and user of UNM's digital platforms.",
  ),
  sections: [
    {
      id: 'definitions',
      number: '01',
      title: t('Définitions', 'Definitions'),
      blocks: [
        {
          type: 'definitions',
          items: [
            { term: t("L'UNM", 'UNM'), value: t("L'Université Numérique du Maroc, dont l'identification figure aux Mentions Légales du Site.", 'Université Numérique du Maroc, identified in the Legal Notice.') },
            { term: t('Le Site', 'The Website'), value: t("L'ensemble des pages et services numériques accessibles à l'adresse officielle de l'UNM et ses sous-domaines.", 'All pages and digital services accessible at the official UNM URL and its subdomains.') },
            { term: t("L'Utilisateur", 'User'), value: t("Toute personne physique ou morale qui accède au Site, qu'elle dispose ou non d'un compte personnel.", 'Any natural or legal person who accesses the Website, whether or not they have a personal account.') },
            { term: t('Le Visiteur', 'Visitor'), value: t('Utilisateur navigant sur le Site sans compte personnel.', 'User browsing the Website without a personal account.') },
            { term: t('Le Candidat', 'Applicant'), value: t("Utilisateur ayant déposé une candidature à un programme de l'UNM.", 'User who has submitted an application to a UNM programme.') },
            { term: t('Le Participant', 'Participant'), value: t("Utilisateur admis à un programme de l'UNM et inscrit administrativement.", 'User admitted to a UNM programme and administratively enrolled.') },
            { term: t('Le Compte', 'Account'), value: t('Espace personnel sécurisé donnant accès à des services réservés.', 'Secure personal area providing access to reserved services.') },
            { term: t("L'Espace Participant", 'Participant Area'), value: t("Environnement numérique d'apprentissage (LMS) accessible aux Participants en cours de formation.", 'Digital learning environment (LMS) available to Participants in training.') },
          ],
        },
      ],
    },
    {
      id: 'objet',
      number: '02',
      title: t('Objet et acceptation', 'Purpose and acceptance'),
      blocks: [
        { type: 'p', text: t("Les présentes CGU ont pour objet de fixer les conditions dans lesquelles l'UNM met à disposition de l'Utilisateur ses Services en ligne.", 'These Terms set out the conditions under which UNM provides its online Services.') },
        { type: 'p', text: t("L'utilisation du Site vaut acceptation pleine, entière et sans réserve des présentes CGU. Si l'Utilisateur n'accepte pas tout ou partie des présentes, il doit s'abstenir d'utiliser le Site.", 'Use of the Website constitutes full, complete and unreserved acceptance of these Terms. Users who do not accept all or part of these Terms must refrain from using the Website.') },
      ],
    },
    {
      id: 'services',
      number: '03',
      title: t('Description des Services', 'Description of services'),
      blocks: [
        { type: 'lead', text: t('Le Site donne accès à trois niveaux de services.', 'The Website provides three levels of services.') },
        { type: 'p', text: t('Accès libre — sans création de compte : tout Visiteur peut consulter les informations institutionnelles, découvrir les facultés et programmes, accéder aux contenus éditoriaux, télécharger les brochures et contacter les services.', 'Free access — no account required: any Visitor can browse institutional information, discover faculties and programmes, access editorial content, download brochures and contact the services.') },
        { type: 'p', text: t("Services soumis à création de compte : dépôt et suivi d'un dossier de candidature, inscription aux événements, accès à des contenus réservés.", 'Account-based services: submission and tracking of an application, event registration, access to reserved content.') },
        { type: 'p', text: t("Espace Participant (LMS) : réservé aux Participants admis et inscrits administrativement. Il donne accès aux supports de cours, aux classes virtuelles, aux outils de collaboration et d'évaluation, au suivi du parcours académique et à l'annuaire de la communauté.", 'Participant Area (LMS): reserved for admitted and enrolled Participants. It provides access to course materials, virtual classes, collaboration and assessment tools, academic tracking and the community directory.') },
        {
          type: 'callout',
          text: t(
            "L'accès à l'Espace Participant est régi, en complément des présentes, par le règlement intérieur académique de l'UNM remis lors de l'inscription.",
            "Access to the Participant Area is governed, in addition to these Terms, by UNM's internal academic regulations provided upon enrolment.",
          ),
        },
      ],
    },
    {
      id: 'compte',
      number: '04',
      title: t('Création et gestion du compte', 'Account creation and management'),
      blocks: [
        { type: 'p', text: t("La création d'un Compte est ouverte à toute personne physique majeure. L'Utilisateur garantit l'exactitude des informations communiquées et s'engage à les maintenir à jour. L'inscription requiert une adresse électronique valide, un mot de passe robuste et l'acceptation explicite des présentes CGU et de la Politique de Protection des Données.", 'Account creation is open to any individual of legal age. Users guarantee the accuracy of the information provided and undertake to keep it up to date. Registration requires a valid email address, a strong password and explicit acceptance of these Terms and the Data Protection Policy.') },
        { type: 'p', text: t("L'identifiant et le mot de passe sont strictement personnels et confidentiels. Toute action effectuée depuis le Compte est réputée l'avoir été par son titulaire. En cas de perte, vol ou usage frauduleux suspecté, l'Utilisateur doit immédiatement modifier son mot de passe et en informer l'UNM.", 'Login credentials are strictly personal and confidential. Any action carried out from the Account is deemed to have been performed by its holder. In the event of suspected loss, theft or fraudulent use, the User must immediately change their password and notify UNM.') },
      ],
    },
    {
      id: 'charte',
      number: '05',
      title: t('Charte de bonne conduite', 'Code of conduct'),
      blocks: [
        { type: 'lead', text: t("L'UNM rassemble une communauté de dirigeants, cadres et professionnels engagés. Le respect mutuel et l'éthique professionnelle fondent la qualité de cette communauté.", 'UNM brings together a community of committed executives, managers and professionals. Mutual respect and professional ethics underpin the quality of this community.') },
        { type: 'p', text: t("Dans tous les espaces interactifs du Site, l'Utilisateur s'engage à :", 'In all interactive spaces of the Website, Users undertake to:') },
        {
          type: 'list',
          items: [
            t('Respecter la dignité, la confidentialité et la diversité de chaque membre de la communauté.', 'Respect the dignity, confidentiality and diversity of every community member.'),
            t("S'exprimer dans un langage professionnel et courtois.", 'Use professional and courteous language.'),
            t('Respecter la confidentialité des échanges pédagogiques et professionnels.', 'Respect the confidentiality of pedagogical and professional exchanges.'),
            t("Ne pas diffuser de contenus discriminatoires, diffamatoires, injurieux, violents, racistes, sexistes ou contraires à l'ordre public.", 'Not share discriminatory, defamatory, abusive, violent, racist, sexist or unlawful content.'),
            t('Ne pas porter atteinte aux droits de propriété intellectuelle de tiers.', 'Not infringe the intellectual property rights of third parties.'),
            t('Ne pas utiliser les Services à des fins de prospection commerciale, politique ou religieuse.', 'Not use the Services for commercial, political or religious solicitation.'),
            t("Ne pas diffuser de contenus relevant du secret professionnel ou du secret des affaires sans autorisation appropriée.", 'Not share information covered by professional or business confidentiality without appropriate authorisation.'),
          ],
        },
        { type: 'p', text: t("Le manquement à ces règles peut entraîner la modération du contenu, la suspension ou la suppression du Compte, sans préjudice des poursuites éventuelles.", 'A breach of these rules may result in content moderation, suspension or termination of the Account, without prejudice to any legal action.') },
      ],
    },
    {
      id: 'contenus-utilisateur',
      number: '06',
      title: t("Contenus déposés par l'utilisateur", 'User-submitted content'),
      blocks: [
        { type: 'p', text: t("Dans le cadre de sa candidature ou de son parcours, l'Utilisateur peut être amené à déposer des contenus : pièces justificatives, lettre de motivation, projet professionnel, devoirs, mémoires, présentations.", 'During their application or programme, Users may submit content: supporting documents, cover letters, professional projects, assignments, dissertations, presentations.') },
        { type: 'p', text: t("L'Utilisateur garantit qu'il dispose de l'ensemble des droits nécessaires sur les contenus qu'il dépose, et que ceux-ci ne portent atteinte à aucun droit de tiers. Il s'engage à respecter le secret professionnel et le secret des affaires de son employeur ou de ses clients.", 'Users guarantee they hold all necessary rights to the content submitted, and that such content infringes no third-party rights. They undertake to respect the professional and business confidentiality of their employer and clients.') },
        {
          type: 'callout',
          text: t(
            "Sur demande motivée, certains travaux académiques peuvent être traités sous régime de confidentialité renforcée (accès restreint, diffusion limitée, soutenance à huis-clos).",
            'On reasoned request, certain academic works may be processed under enhanced confidentiality (restricted access, limited distribution, closed-door defence).',
          ),
        },
        { type: 'p', text: t("L'Utilisateur concède à l'UNM, sur les contenus déposés, une licence non exclusive, gratuite et limitée aux usages pédagogiques internes : évaluation, conservation académique, diffusion dans le cadre strict de la formation, à l'exclusion de toute exploitation commerciale.", 'Users grant UNM a non-exclusive, free and limited licence on submitted content for internal pedagogical use: assessment, academic archiving, distribution strictly within the training context, excluding any commercial exploitation.') },
      ],
    },
    {
      id: 'propriete',
      number: '07',
      title: t("Propriété intellectuelle des contenus de l'UNM", "UNM content intellectual property"),
      blocks: [
        { type: 'p', text: t("L'ensemble des contenus mis à disposition par l'UNM (textes, visuels, vidéos, supports de cours, études de cas, exercices, examens) est protégé par la loi marocaine n° 2-00 relative aux droits d'auteur et droits voisins.", 'All content made available by UNM (texts, visuals, videos, course materials, case studies, exercises, exams) is protected under Moroccan Law No. 2-00 on copyright and related rights.') },
        { type: 'p', text: t("Le Participant bénéficie d'un droit d'usage strictement personnel des supports pédagogiques, pour les besoins exclusifs de sa formation.", 'Participants benefit from a strictly personal right of use of pedagogical materials, for the exclusive needs of their training.') },
        { type: 'p', text: t("Sont notamment interdits, sauf autorisation expresse de l'UNM :", 'The following are prohibited unless expressly authorised by UNM:') },
        {
          type: 'list',
          items: [
            t('La reproduction, la diffusion ou la publication des supports de cours sur tout support.', 'Reproduction, distribution or publication of course materials on any medium.'),
            t('L\'enregistrement audio ou vidéo des classes virtuelles.', 'Audio or video recording of virtual classes.'),
            t('La transmission des accès à l\'Espace Participant à des tiers.', 'Sharing Participant Area access with third parties.'),
            t('L\'usage des contenus à des fins commerciales, de formation tierce ou de revente.', 'Use of content for commercial purposes, third-party training or resale.'),
          ],
        },
      ],
    },
    {
      id: 'disponibilite',
      number: '08',
      title: t('Disponibilité des services', 'Service availability'),
      blocks: [
        { type: 'p', text: t("L'UNM met en œuvre les moyens raisonnables pour assurer l'accès continu et performant à ses Services. Toutefois, le Site et l'Espace Participant peuvent connaître des interruptions liées à des opérations de maintenance, à des mises à jour techniques, à des incidents techniques, attaques informatiques ou cas de force majeure.", 'UNM takes reasonable steps to ensure continuous and performant access to its Services. However, the Website and Participant Area may experience interruptions due to maintenance, technical updates, technical incidents, cyber-attacks or cases of force majeure.') },
        { type: 'p', text: t("L'UNM ne saurait être tenue responsable des interruptions ne lui étant pas directement imputables, ni des dommages indirects (perte de chance, perte de données, perte de temps) qui en résulteraient.", 'UNM cannot be held liable for interruptions not directly attributable to it, nor for indirect damages (loss of chance, loss of data, loss of time) resulting from them.') },
        { type: 'p', text: t("L'Utilisateur est invité à conserver des copies locales des documents importants téléchargés depuis le Site.", 'Users are advised to keep local copies of important documents downloaded from the Website.') },
      ],
    },
    {
      id: 'liens',
      number: '09',
      title: t('Liens hypertextes', 'Hyperlinks'),
      blocks: [
        { type: 'p', text: t("Le Site peut contenir des liens vers des ressources externes (partenaires, publications, plateformes vidéo). L'UNM n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou leurs pratiques.", 'The Website may contain links to external resources (partners, publications, video platforms). UNM has no control over these sites and declines any responsibility for their content, availability or practices.') },
        { type: 'p', text: t("Tout lien hypertexte pointant vers le Site doit faire l'objet d'une autorisation écrite et préalable de l'UNM.", 'Any hyperlink pointing to the Website requires prior written authorisation from UNM.') },
      ],
    },
    {
      id: 'resiliation',
      number: '10',
      title: t('Suspension et résiliation du compte', 'Account suspension and termination'),
      blocks: [
        { type: 'p', text: t("L'Utilisateur peut demander à tout moment la suppression de son Compte en contactant le support. La suppression entraîne la perte de l'accès aux Services, sous réserve des obligations légales de conservation des données académiques pour les Participants admis.", 'Users may request deletion of their Account at any time by contacting support. Deletion results in loss of access to the Services, subject to legal obligations regarding the retention of academic data for admitted Participants.') },
        { type: 'p', text: t("L'UNM se réserve le droit, sans préavis et sans indemnité, de suspendre ou supprimer un Compte en cas de manquement grave aux présentes, de communication d'informations fausses, d'atteinte aux droits de l'UNM, de tentative d'intrusion ou de comportement contraire à la charte de bonne conduite.", 'UNM reserves the right, without notice and without compensation, to suspend or terminate an Account in case of serious breach of these Terms, false information, infringement of UNM rights, intrusion attempts or behaviour contrary to the code of conduct.') },
      ],
    },
    {
      id: 'donnees',
      number: '11',
      title: t('Données personnelles', 'Personal data'),
      blocks: [
        { type: 'p', text: t("Le traitement des données personnelles de l'Utilisateur est régi par la Politique de Protection des Données et des Cookies de l'UNM, conforme à la loi marocaine n° 09-08 et aux décisions de la CNDP.", "The processing of Users' personal data is governed by UNM's Data Protection and Cookies Policy, in compliance with Moroccan Law No. 09-08 and the decisions of the CNDP.") },
      ],
    },
    {
      id: 'modification',
      number: '12',
      title: t('Modification des CGU', 'Terms modification'),
      blocks: [
        { type: 'p', text: t("L'UNM se réserve le droit de modifier à tout moment les présentes CGU pour les adapter aux évolutions du Site, des Services, du cadre légal ou de ses pratiques. Les modifications substantielles font l'objet d'une notification aux Utilisateurs disposant d'un Compte. La version applicable est celle en vigueur au moment de l'accès au Site.", 'UNM reserves the right to modify these Terms at any time to reflect changes in the Website, Services, legal framework or its practices. Substantial changes are notified to Users with an Account. The applicable version is the one in force at the time of access.') },
      ],
    },
    {
      id: 'loi-juridiction',
      number: '13',
      title: t('Loi applicable et juridiction', 'Governing law and jurisdiction'),
      blocks: [
        { type: 'p', text: t("Les présentes CGU sont régies par le droit marocain. Tout litige relèvera de la compétence exclusive des tribunaux du ressort du siège. Les Utilisateurs résidant hors du Maroc reconnaissent expressément la compétence des juridictions marocaines.", 'These Terms are governed by Moroccan law. Any dispute shall fall under the exclusive jurisdiction of the courts of the registered office district. Users residing outside Morocco expressly acknowledge the jurisdiction of Moroccan courts.') },
      ],
    },
    {
      id: 'contact',
      number: '14',
      title: t('Contact', 'Contact'),
      blocks: [
        {
          type: 'definitions',
          items: [
            { term: t('Courriel', 'Email'), value: t('contact@unm.ma', 'contact@unm.ma') },
            { term: t('Téléphone', 'Phone'), value: t('+212 6 62 62 62 19', '+212 6 62 62 62 19') },
          ],
        },
      ],
    },
  ],
};
