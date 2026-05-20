import type { LegalDocument } from './types';

const t = (fr: string, en: string) => ({ fr, en });

export const mentionsLegales: LegalDocument = {
  key: 'mentions',
  href: { fr: '/mentions-legales', en: '/en/legal-notice' },
  shortLabel: t('Mentions légales', 'Legal Notice'),
  title: t('Mentions légales', 'Legal Notice'),
  metaTitle: t('Mentions légales | Université Numérique du Maroc', 'Legal Notice | Université Numérique du Maroc'),
  metaDescription: t(
    "Mentions légales de l'Université Numérique du Maroc (UNM) : éditeur, hébergeur, propriété intellectuelle et conditions d'utilisation du site.",
    'Official legal notice of the Université Numérique du Maroc (UNM): publisher details, hosting, intellectual property and website terms of use.',
  ),
  lastUpdated: '2026-05-17',
  intro: t(
    "Les présentes mentions légales régissent l'utilisation du site officiel de l'Université Numérique du Maroc (UNM), établies conformément aux dispositions du droit marocain en vigueur, notamment la loi n° 53-05 relative à l'échange électronique de données juridiques.",
    'This legal notice governs the use of the official website of Université Numérique du Maroc (UNM), established in accordance with applicable Moroccan law, in particular Law No. 53-05 on the electronic exchange of legal data.',
  ),
  sections: [
    {
      id: 'editeur',
      number: '01',
      title: t('Éditeur du site', 'Publisher'),
      blocks: [
        { type: 'p', text: t("Le site est édité par l'Université Numérique du Maroc, ci-après désignée « l'UNM ».", 'The website is published by Université Numérique du Maroc, hereinafter referred to as "UNM".') },
        {
          type: 'definitions',
          items: [
            { term: t('Dénomination', 'Name'), value: t('Université Numérique du Maroc (UNM)', 'Université Numérique du Maroc (UNM)') },
            { term: t('Forme juridique', 'Legal form'), value: t('À compléter', 'To be confirmed') },
            { term: t('Siège social', 'Registered office'), value: t('Campus Marrakech — Borj Menara I, Av. Abdelkrim El Khattabi · Campus Laâyoune — N°8, Al Bouchra, Av. Alfourssane', 'Marrakech Campus — Borj Menara I, Av. Abdelkrim El Khattabi · Laâyoune Campus — N°8, Al Bouchra, Av. Alfourssane') },
            { term: t('Registre de commerce (RC)', 'Trade Register (RC)'), value: t('À compléter', 'To be confirmed') },
            { term: t("Identifiant Commun de l'Entreprise (ICE)", 'Common Business Identifier (ICE)'), value: t('À compléter', 'To be confirmed') },
            { term: t('Identifiant Fiscal (IF)', 'Tax Identification Number (IF)'), value: t('À compléter', 'To be confirmed') },
            { term: t('Téléphone', 'Phone'), value: t('+212 6 62 62 62 19', '+212 6 62 62 62 19') },
            { term: t('Courriel', 'Email'), value: t('contact@unm.ma', 'contact@unm.ma') },
            { term: t('Directeur de la publication', 'Publication Director'), value: t('Pr Mohammed Amine Balambo, Président', 'Pr Mohammed Amine Balambo, President') },
          ],
        },
      ],
    },
    {
      id: 'hebergement',
      number: '02',
      title: t('Hébergement du site', 'Hosting'),
      blocks: [
        { type: 'p', text: t("Le site est hébergé par un prestataire technique conformément aux exigences de disponibilité, de sécurité et de confidentialité requises.", 'The website is hosted by a technical provider in accordance with the required availability, security and confidentiality standards.') },
        {
          type: 'definitions',
          items: [
            { term: t('Société', 'Company'), value: t('À compléter', 'To be confirmed') },
            { term: t('Adresse', 'Address'), value: t('À compléter', 'To be confirmed') },
          ],
        },
      ],
    },
    {
      id: 'objet',
      number: '03',
      title: t('Objet du site', 'Purpose of the website'),
      blocks: [
        { type: 'p', text: t("Le site officiel de l'UNM a pour objet de présenter l'institution, ses facultés, ses programmes et ses activités académiques.", 'The official UNM website is intended to present the institution, its faculties, programmes and academic activities.') },
        { type: 'p', text: t("Il permet notamment, sans création de compte personnel, de :", 'Without creating a personal account, users can:') },
        {
          type: 'list',
          items: [
            t("Consulter les informations relatives à l'UNM, à sa vision et à sa gouvernance.", 'Browse information about UNM, its vision and its governance.'),
            t('Découvrir les programmes proposés par la Business School et les facultés en préparation.', 'Discover the programmes offered by the Business School and the upcoming faculties.'),
            t("Accéder aux informations relatives aux conditions d'admission et au financement.", 'Access admission requirements and financing information.'),
            t("Consulter les actualités, événements et publications de l'institution.", 'Read news, events and publications produced by the institution.'),
            t('Prendre contact avec les services administratifs et académiques.', 'Contact academic and administrative services.'),
            t('Déposer une candidature en ligne aux programmes ouverts.', 'Submit an online application to open programmes.'),
          ],
        },
        { type: 'p', text: t("L'accès à certaines fonctionnalités, notamment le suivi du dossier de candidature et l'espace participant, peut nécessiter la création d'un compte personnel.", 'Access to certain features, such as application tracking and the participant area, may require the creation of a personal account.') },
      ],
    },
    {
      id: 'compte',
      number: '04',
      title: t("Création d'un compte personnel", 'Personal account creation'),
      blocks: [
        { type: 'p', text: t("L'accès à la consultation libre du site ne requiert aucune création de compte. La création d'un compte est nécessaire pour accéder à certains services réservés, notamment le dépôt et le suivi d'un dossier de candidature.", 'Free browsing of the website does not require account creation. A personal account is required to access reserved services, including the submission and tracking of an application file.') },
        { type: 'p', text: t("Lors de la création de son compte, l'utilisateur s'engage à fournir des informations exactes, complètes et à jour. L'identifiant et le mot de passe sont strictement personnels et confidentiels.", 'When creating an account, users undertake to provide accurate, complete and up-to-date information. Login credentials are strictly personal and confidential.') },
      ],
    },
    {
      id: 'propriete-intellectuelle',
      number: '05',
      title: t('Propriété intellectuelle', 'Intellectual property'),
      blocks: [
        { type: 'p', text: t("L'ensemble du contenu du site — textes, visuels, photographies, vidéos, sons, logos, marques, bases de données, charte graphique et architecture — est la propriété exclusive de l'UNM ou de ses partenaires, et est protégé par les dispositions de la loi marocaine n° 2-00 relative aux droits d'auteur et droits voisins, ainsi que par les conventions internationales en vigueur.", 'All content on the website — texts, visuals, photographs, videos, audio, logos, trademarks, databases, graphic design and architecture — is the exclusive property of UNM or its partners, and is protected under Moroccan Law No. 2-00 on copyright and related rights, as well as applicable international conventions.') },
        { type: 'p', text: t("Toute reproduction, représentation, modification, publication, adaptation, traduction ou exploitation, totale ou partielle, des éléments du site est interdite sans l'autorisation écrite et préalable de l'UNM.", 'Any reproduction, representation, modification, publication, adaptation, translation or exploitation, in whole or in part, of any element of the website is prohibited without the prior written authorisation of UNM.') },
        {
          type: 'callout',
          text: t(
            "Les marques, logos et signes distinctifs figurant sur le site sont la propriété de l'UNM ou de ses partenaires institutionnels, notamment European Business School. Toute reproduction sans autorisation expresse est prohibée.",
            "Trademarks, logos and distinctive signs appearing on the website are the property of UNM or its institutional partners, notably European Business School. Any reproduction without express authorisation is prohibited.",
          ),
        },
      ],
    },
    {
      id: 'donnees',
      number: '06',
      title: t('Protection des données personnelles', 'Personal data protection'),
      blocks: [
        { type: 'p', text: t("Les traitements de données personnelles mis en œuvre sur le site respectent la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, ainsi que les décisions de la Commission Nationale de contrôle de la Protection des Données à caractère Personnel (CNDP).", 'Personal data processing on the website complies with Law No. 09-08 on the protection of individuals with regard to the processing of personal data, and with the decisions of the National Commission for the Control of Personal Data Protection (CNDP).') },
        { type: 'p', text: t("Conformément à cette loi, l'utilisateur dispose d'un droit d'accès, de rectification, d'opposition et de suppression des données le concernant. Les modalités détaillées sont précisées dans la Politique de protection des données et des cookies.", 'In accordance with this law, users have the right to access, rectify, object to and delete their data. Detailed terms are set out in the Data Protection and Cookies Policy.') },
      ],
    },
    {
      id: 'liens',
      number: '07',
      title: t('Liens hypertextes', 'Hyperlinks'),
      blocks: [
        { type: 'p', text: t("Tout lien hypertexte pointant vers le site officiel de l'UNM doit faire l'objet d'une autorisation écrite et préalable de l'institution.", 'Any hyperlink pointing to the official UNM website requires prior written authorisation from the institution.') },
        { type: 'p', text: t("Le site peut contenir des liens vers des sites tiers. L'UNM ne saurait être tenue responsable du contenu, de la disponibilité ou des pratiques de ces sites externes.", 'The website may contain links to third-party websites. UNM cannot be held responsible for the content, availability or practices of these external sites.') },
      ],
    },
    {
      id: 'responsabilites',
      number: '08',
      title: t("Responsabilités de l'utilisateur", 'User responsibilities'),
      blocks: [
        { type: 'p', text: t("L'utilisateur s'engage à accéder au site et à l'utiliser dans le respect des présentes mentions légales et du droit marocain en vigueur. Il s'interdit notamment de :", 'Users undertake to access and use the website in compliance with this legal notice and applicable Moroccan law. They specifically agree not to:') },
        {
          type: 'list',
          items: [
            t("Porter atteinte aux droits de propriété intellectuelle de l'UNM ou de tiers.", 'Infringe the intellectual property rights of UNM or third parties.'),
            t('Capter, extraire ou réutiliser tout ou partie du contenu du site sans autorisation.', "Capture, extract or reuse all or part of the website's content without authorisation."),
            t('Perturber le bon fonctionnement du site ou de ses services.', 'Disrupt the proper functioning of the website or its services.'),
            t("Usurper l'identité d'un tiers ou utiliser une fausse identité.", 'Impersonate a third party or use a false identity.'),
            t('Utiliser des dispositifs automatisés (robots, scripts, scraping) pour accéder au site.', 'Use automated tools (bots, scripts, scraping) to access the website.'),
          ],
        },
      ],
    },
    {
      id: 'responsabilite-unm',
      number: '09',
      title: t("Responsabilité de l'UNM", "UNM's liability"),
      blocks: [
        { type: 'p', text: t("L'UNM met en œuvre les moyens raisonnables pour assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, ces informations sont fournies à titre indicatif et peuvent être modifiées sans préavis.", 'UNM takes reasonable steps to ensure the accuracy and timeliness of the information published on the website. However, this information is provided for guidance only and may be modified without prior notice.') },
        { type: 'p', text: t("L'utilisateur reconnaît utiliser le site sous sa seule responsabilité. L'UNM ne saurait être tenue responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site.", 'Users acknowledge that they use the website at their own risk. UNM cannot be held liable for direct or indirect damages resulting from access to or use of the website.') },
      ],
    },
    {
      id: 'modification',
      number: '10',
      title: t('Modification des mentions légales', 'Modification of the legal notice'),
      blocks: [
        { type: 'p', text: t("L'UNM se réserve le droit de modifier les présentes mentions légales à tout moment. Les utilisateurs sont invités à les consulter régulièrement. La version applicable est celle en vigueur au moment de la consultation du site.", 'UNM reserves the right to modify this legal notice at any time. Users are invited to consult it regularly. The applicable version is the one in force at the time of consultation.') },
      ],
    },
    {
      id: 'loi-juridiction',
      number: '11',
      title: t('Loi applicable et juridiction compétente', 'Governing law and jurisdiction'),
      blocks: [
        { type: 'p', text: t("Les présentes mentions légales sont régies par le droit marocain. Tout litige relatif à leur interprétation ou à leur exécution, qui ne pourrait être résolu à l'amiable, relèvera de la compétence exclusive des tribunaux du ressort du siège, conformément à la législation marocaine en vigueur.", 'This legal notice is governed by Moroccan law. Any dispute relating to its interpretation or performance that cannot be resolved amicably shall fall under the exclusive jurisdiction of the courts of the registered office district, in accordance with applicable Moroccan law.') },
      ],
    },
    {
      id: 'contact',
      number: '12',
      title: t('Contact', 'Contact'),
      blocks: [
        { type: 'p', text: t("Pour toute question relative aux présentes mentions légales, l'utilisateur peut contacter l'UNM aux coordonnées suivantes :", 'For any question concerning this legal notice, users may contact UNM at the following:') },
        {
          type: 'definitions',
          items: [
            { term: t('Courriel', 'Email'), value: t('contact@unm.ma', 'contact@unm.ma') },
            { term: t('Téléphone', 'Phone'), value: t('+212 6 62 62 62 19', '+212 6 62 62 62 19') },
            { term: t('Adresse', 'Address'), value: t('Campus Marrakech — Borj Menara I, Av. Abdelkrim El Khattabi', 'Marrakech Campus — Borj Menara I, Av. Abdelkrim El Khattabi') },
          ],
        },
      ],
    },
  ],
};
