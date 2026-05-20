import type { LegalDocument } from './types';

const t = (fr: string, en: string) => ({ fr, en });

export const confidentialite: LegalDocument = {
  key: 'confidentialite',
  href: { fr: '/confidentialite', en: '/en/privacy' },
  shortLabel: t('Données & Cookies', 'Data & Cookies'),
  title: t('Politique de protection des données et cookies', 'Data Protection and Cookies Policy'),
  metaTitle: t(
    'Politique de protection des données et cookies | Université Numérique du Maroc',
    'Data Protection and Cookies Policy | Université Numérique du Maroc',
  ),
  metaDescription: t(
    "Comment l'UNM collecte, utilise et protège vos données personnelles, et la politique de cookies du site, conformément à la loi marocaine n° 09-08 et aux décisions de la CNDP.",
    "How UNM collects, uses and protects your personal data, and the website's cookie policy, in accordance with Moroccan Law No. 09-08 and CNDP decisions.",
  ),
  lastUpdated: '2026-05-17',
  intro: t(
    "Les dirigeants, cadres et professionnels qui rejoignent l'UNM nous confient des informations sensibles : leurs parcours, leurs ambitions, leurs travaux, parfois des données relatives à leur organisation. Cette politique précise comment l'UNM protège ces informations, dans le strict respect de la loi marocaine n° 09-08 et des décisions de la CNDP.",
    'The executives, managers and professionals who join UNM entrust us with sensitive information: their backgrounds, ambitions, work, sometimes data relating to their organisations. This policy explains how UNM protects this information, in strict compliance with Moroccan Law No. 09-08 and CNDP decisions.',
  ),
  sections: [
    {
      id: 'cadre',
      number: '01',
      title: t('Cadre légal', 'Legal framework'),
      blocks: [
        { type: 'p', text: t('La présente Politique est établie en conformité avec :', 'This Policy is established in accordance with:') },
        {
          type: 'list',
          items: [
            t("La loi marocaine n° 09-08 du 18 février 2009 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et son décret d'application n° 2-09-165.", 'Moroccan Law No. 09-08 of 18 February 2009 on the protection of individuals with regard to the processing of personal data and its implementing decree No. 2-09-165.'),
            t('Les décisions et délibérations de la Commission Nationale de contrôle de la Protection des Données à caractère Personnel (CNDP).', 'The decisions and deliberations of the National Commission for the Control of Personal Data Protection (CNDP).'),
            t("La loi n° 53-05 du 30 novembre 2007 relative à l'échange électronique de données juridiques.", 'Law No. 53-05 of 30 November 2007 on the electronic exchange of legal data.'),
            t("Les conventions internationales applicables, notamment la Convention 108+ du Conseil de l'Europe à laquelle le Maroc a adhéré.", 'Applicable international conventions, including Council of Europe Convention 108+ to which Morocco has acceded.'),
          ],
        },
        { type: 'p', text: t("Pour les Personnes concernées résidant dans l'Union européenne, les standards du Règlement Général sur la Protection des Données (RGPD) sont appliqués à titre complémentaire lorsque pertinent.", 'For Data Subjects residing in the European Union, the standards of the General Data Protection Regulation (GDPR) apply complementarily where relevant.') },
      ],
    },
    {
      id: 'responsable',
      number: '02',
      title: t('Responsable de traitement', 'Data controller'),
      blocks: [
        { type: 'p', text: t("Le responsable de traitement est l'Université Numérique du Maroc (UNM), identifiée aux Mentions Légales.", 'The data controller is Université Numérique du Maroc (UNM), identified in the Legal Notice.') },
        {
          type: 'definitions',
          items: [
            { term: t('Délégué à la Protection des Données (DPO)', 'Data Protection Officer (DPO)'), value: t('dpo@unm.ma · adresse postale au siège', 'dpo@unm.ma · postal address at registered office') },
            { term: t('Déclaration CNDP', 'CNDP declaration'), value: t('Numéro de récépissé à compléter une fois la déclaration finalisée.', 'Receipt number to be confirmed once the declaration is finalised.') },
          ],
        },
      ],
    },
    {
      id: 'confidentialite-renforcee',
      number: '03',
      title: t('Engagement de confidentialité renforcée', 'Enhanced confidentiality commitment'),
      blocks: [
        { type: 'lead', text: t("L'UNM accueille des dirigeants, cadres supérieurs, hauts fonctionnaires et entrepreneurs dont les profils, les travaux et les projets peuvent revêtir un caractère sensible.", 'UNM welcomes executives, senior managers, senior public officials and entrepreneurs whose profiles, work and projects may be sensitive in nature.') },
        {
          type: 'list',
          items: [
            t('Confidentialité des profils : aucune communication d\'information nominative sur l\'inscription, l\'admission ou le parcours d\'un Participant à des tiers non autorisés.', 'Profile confidentiality: no disclosure of personal information about a Participant\'s enrolment, admission or journey to unauthorised third parties.'),
            t('Confidentialité des travaux : possibilité de placement sous régime de confidentialité renforcée pour les mémoires, projets et études de cas comportant des données stratégiques d\'entreprise.', 'Work confidentiality: enhanced confidentiality available for dissertations, projects and case studies containing strategic corporate data.'),
            t('Discrétion institutionnelle : aucune publication, citation ou exploitation publique d\'un nom de Participant sans son accord exprès et écrit.', 'Institutional discretion: no publication, citation or public use of a Participant\'s name without their express written consent.'),
            t("Sensibilité géopolitique : prise en compte particulière pour les Participants exerçant des fonctions exposées (responsabilités publiques, dirigeants d'entreprises stratégiques, professions sensibles).", 'Geopolitical sensitivity: special consideration for Participants in exposed positions (public responsibilities, leaders of strategic companies, sensitive professions).'),
          ],
        },
      ],
    },
    {
      id: 'donnees-collectees',
      number: '04',
      title: t('Données collectées', 'Data collected'),
      blocks: [
        { type: 'p', text: t("L'UNM ne collecte que les données strictement nécessaires aux finalités poursuivies.", 'UNM only collects data that is strictly necessary for the purposes pursued.') },
        { type: 'p', text: t('Lors de la navigation (sans compte) : données techniques (adresse IP, navigateur, OS, pages visitées) et cookies.', 'During browsing (no account): technical data (IP address, browser, OS, pages visited) and cookies.') },
        { type: 'p', text: t("Lors de la création du compte : identification (nom, prénom, civilité), coordonnées (email, téléphone, pays), données d'authentification (mot de passe chiffré).", 'During account creation: identification (last name, first name, title), contact details (email, phone, country), authentication data (encrypted password).') },
        { type: 'p', text: t("Lors d'une candidature : identité complète, coordonnées, diplômes, CV, expérience professionnelle, lettre de motivation, données relatives au financement.", 'During application: full identity, contact details, degrees, CV, professional experience, cover letter, financing data.') },
        { type: 'p', text: t("Pendant le programme : données académiques (présence, évaluations, notes, travaux, mémoire), données d'usage de la plateforme LMS, échanges avec le corps enseignant.", 'During the programme: academic data (attendance, assessments, grades, work, dissertation), LMS platform usage data, exchanges with faculty.') },
        {
          type: 'callout',
          text: t(
            "L'UNM ne collecte aucune donnée sensible au sens de l'article 1.3 de la loi 09-08 (origine raciale ou ethnique, opinions politiques, philosophiques ou religieuses, données de santé), sauf exception légalement encadrée avec consentement exprès.",
            'UNM collects no sensitive data within the meaning of Article 1.3 of Law 09-08 (racial or ethnic origin, political, philosophical or religious opinions, health data), except for legally framed exceptions with express consent.',
          ),
        },
      ],
    },
    {
      id: 'finalites',
      number: '05',
      title: t('Bases légales et finalités', 'Legal bases and purposes'),
      blocks: [
        { type: 'p', text: t('Chaque traitement de données repose sur une base légale précise.', 'Each data processing operation is based on a specific legal basis.') },
        {
          type: 'table',
          headers: [t('Finalité', 'Purpose'), t('Base légale', 'Legal basis'), t('Données', 'Data')],
          rows: [
            [t('Gestion du compte utilisateur', 'User account management'), t("Exécution d'un contrat", 'Contract performance'), t('Identification, authentification', 'Identification, authentication')],
            [t('Instruction de la candidature', 'Application review'), t('Mesures précontractuelles', 'Pre-contractual measures'), t('Identité, académiques, professionnelles', 'Identity, academic, professional')],
            [t('Inscription et suivi pédagogique', 'Enrolment and academic follow-up'), t('Exécution du contrat de formation', 'Training contract performance'), t('Académiques, scolarité, travaux', 'Academic, schooling, work')],
            [t('Délivrance de diplôme', 'Diploma issuance'), t('Obligation légale et académique', 'Legal and academic obligation'), t('Académiques, identité', 'Academic, identity')],
            [t('Facturation et comptabilité', 'Invoicing and accounting'), t('Obligation légale', 'Legal obligation'), t('Financières, identification', 'Financial, identification')],
            [t('Communication institutionnelle', 'Institutional communication'), t('Consentement (opt-in)', 'Consent (opt-in)'), t('Coordonnées électroniques', 'Electronic contact details')],
            [t('Statistiques anonymisées', 'Anonymised statistics'), t('Intérêt légitime', 'Legitimate interest'), t('Données agrégées', 'Aggregated data')],
            [t('Sécurité et prévention des fraudes', 'Security and fraud prevention'), t('Intérêt légitime', 'Legitimate interest'), t("Techniques, journaux d'accès", 'Technical, access logs')],
          ],
        },
      ],
    },
    {
      id: 'destinataires',
      number: '06',
      title: t('Destinataires des données', 'Data recipients'),
      blocks: [
        { type: 'p', text: t("Les données sont accessibles uniquement aux personnes ayant besoin d'en connaître, dans le cadre strict de leurs missions :", 'Data is accessible only to persons who need to know, strictly within the scope of their duties:') },
        {
          type: 'list',
          items: [
            t("Personnel interne de l'UNM (admissions, scolarité, corps enseignant, services informatiques, services financiers, direction académique).", 'UNM internal staff (admissions, schooling, faculty, IT services, finance, academic management).'),
            t('European Business School (EBS) : dans le cadre du partenariat académique, certaines données académiques peuvent être partagées pour la co-délivrance de programmes ou la reconnaissance des acquis.', 'European Business School (EBS): within the academic partnership, certain academic data may be shared for co-delivery of programmes or recognition of prior learning.'),
            t('Sous-traitants techniques (hébergeur, prestataire de paiement, fournisseur LMS, outils de visioconférence, services emailing), liés contractuellement par des obligations de confidentialité équivalentes.', 'Technical subcontractors (host, payment provider, LMS supplier, videoconferencing tools, emailing services), contractually bound by equivalent confidentiality obligations.'),
            t('Autorités administratives ou judiciaires sur réquisition légale et dans les limites des obligations applicables.', 'Administrative or judicial authorities upon legal requisition and within applicable obligations.'),
          ],
        },
      ],
    },
    {
      id: 'transferts',
      number: '07',
      title: t('Transferts internationaux de données', 'International data transfers'),
      blocks: [
        { type: 'p', text: t("Compte tenu de la dimension panafricaine et internationale de l'UNM, certains traitements peuvent impliquer des transferts de données hors du Maroc.", 'Given UNM\'s pan-African and international dimension, some processing may involve data transfers outside Morocco.') },
        { type: 'p', text: t("Les transferts vers l'Union européenne (notamment vers les sites EBS de Paris, Barcelone et Berlin) bénéficient du cadre protecteur du RGPD européen, reconnu par la CNDP comme garantissant un niveau de protection adéquat.", 'Transfers to the European Union (notably to the EBS sites in Paris, Barcelona and Berlin) benefit from the protective framework of the European GDPR, recognised by the CNDP as ensuring an adequate level of protection.') },
        { type: 'p', text: t("Tout transfert international fait l'objet, lorsqu'il y a lieu, d'une demande d'autorisation préalable auprès de la CNDP, conformément aux articles 43 et suivants de la loi 09-08.", 'Any international transfer is, where applicable, subject to a prior authorisation request from the CNDP, in accordance with articles 43 and following of Law 09-08.') },
      ],
    },
    {
      id: 'conservation',
      number: '08',
      title: t('Durée de conservation', 'Retention periods'),
      blocks: [
        { type: 'p', text: t('Les données sont conservées pendant la durée strictement nécessaire à la réalisation des finalités, augmentée des délais légaux de prescription.', 'Data is kept for the duration strictly necessary to achieve the purposes, plus legal limitation periods.') },
        {
          type: 'table',
          headers: [t('Catégorie de données', 'Data category'), t('Durée de conservation', 'Retention period')],
          rows: [
            [t('Données de navigation (sans compte)', 'Browsing data (no account)'), t('13 mois maximum', '13 months maximum')],
            [t('Compte inactif', 'Inactive account'), t('3 ans après dernière connexion', '3 years after last login')],
            [t('Candidatures non retenues', 'Unsuccessful applications'), t('2 ans à compter de la décision', '2 years from the decision')],
            [t('Candidatures retenues et participants', 'Successful applications and participants'), t('Durée du programme + 10 ans après diplomation', 'Programme duration + 10 years after graduation')],
            [t('Données académiques de diplomation', 'Graduation academic records'), t('Archives définitives (registre académique)', 'Permanent archives (academic register)')],
            [t('Données comptables et fiscales', 'Accounting and tax data'), t('10 ans (obligation légale)', '10 years (legal obligation)')],
            [t('Données de prospection commerciale', 'Marketing prospecting data'), t('3 ans à compter du dernier contact', '3 years from last contact')],
            [t('Cookies analytiques', 'Analytics cookies'), t('13 mois maximum', '13 months maximum')],
            [t("Journaux d'accès et de sécurité", 'Access and security logs'), t('12 mois', '12 months')],
          ],
        },
        { type: 'p', text: t('À l\'issue de ces durées, les données sont soit supprimées, soit anonymisées de manière irréversible à des fins statistiques.', 'At the end of these periods, data is either deleted or irreversibly anonymised for statistical purposes.') },
      ],
    },
    {
      id: 'securite',
      number: '09',
      title: t('Sécurité des données', 'Data security'),
      blocks: [
        { type: 'p', text: t("L'UNM met en œuvre des mesures techniques et organisationnelles destinées à garantir la sécurité, la confidentialité et l'intégrité des données :", 'UNM implements technical and organisational measures to ensure the security, confidentiality and integrity of data:') },
        {
          type: 'list',
          items: [
            t('Mesures techniques : chiffrement des communications (HTTPS/TLS), chiffrement des mots de passe, sauvegardes régulières, cloisonnement des environnements, pare-feu, supervision des accès.', 'Technical measures: encryption of communications (HTTPS/TLS), password hashing, regular backups, environment segregation, firewalls, access monitoring.'),
            t("Mesures organisationnelles : politique d'habilitation des accès, formation du personnel à la confidentialité, engagements contractuels des sous-traitants, audits réguliers.", 'Organisational measures: access entitlement policy, staff training on confidentiality, contractual commitments of subcontractors, regular audits.'),
            t('Plan de réponse aux incidents : procédure de détection, de notification (notamment à la CNDP en cas de violation susceptible d\'engendrer un risque pour les personnes) et de remédiation.', 'Incident response plan: detection, notification (including to the CNDP in case of a breach likely to create a risk to individuals) and remediation procedures.'),
          ],
        },
        { type: 'p', text: t("En cas d'incident de sécurité concernant des données personnelles, l'UNM s'engage à informer les personnes concernées dans les meilleurs délais lorsque cet incident est susceptible d'entraîner un risque élevé pour leurs droits.", 'In the event of a security incident concerning personal data, UNM undertakes to inform the data subjects as soon as possible when the incident is likely to entail a high risk to their rights.') },
      ],
    },
    {
      id: 'droits',
      number: '10',
      title: t('Droits des personnes concernées', 'Data subject rights'),
      blocks: [
        { type: 'p', text: t('Conformément à la loi 09-08, toute Personne concernée dispose des droits suivants :', 'In accordance with Law 09-08, every Data Subject has the following rights:') },
        {
          type: 'list',
          items: [
            t("Droit d'accès — Obtenir la confirmation que des données la concernant sont traitées et en obtenir communication.", 'Right of access — Obtain confirmation that data is being processed and obtain a copy.'),
            t('Droit de rectification — Faire rectifier les données inexactes ou incomplètes.', 'Right to rectification — Have inaccurate or incomplete data corrected.'),
            t("Droit d'opposition — S'opposer, pour des motifs légitimes, au traitement de ses données (notamment à toute prospection commerciale).", 'Right to object — Object, for legitimate reasons, to the processing of one\'s data (including any marketing prospecting).'),
            t('Droit de suppression — Obtenir l\'effacement de ses données dans les cas prévus par la loi.', 'Right to erasure — Obtain the deletion of one\'s data in cases provided by law.'),
            t('Droit à la limitation du traitement — Demander la suspension du traitement dans certaines situations.', 'Right to restriction of processing — Request suspension of processing in certain situations.'),
            t('Droit à la portabilité — Recevoir ses données dans un format structuré et lisible.', 'Right to data portability — Receive one\'s data in a structured, machine-readable format.'),
          ],
        },
        { type: 'p', text: t("Ces droits peuvent être exercés en contactant le Délégué à la Protection des Données par courriel (dpo@unm.ma) ou par courrier postal au siège. Une justification d'identité peut être demandée. L'UNM s'engage à répondre dans un délai d'un (1) mois à compter de la réception de la demande complète.", 'These rights may be exercised by contacting the Data Protection Officer by email (dpo@unm.ma) or by postal mail to the registered office. Proof of identity may be requested. UNM undertakes to respond within one (1) month of receipt of the complete request.') },
        {
          type: 'callout',
          text: t(
            'La Personne concernée dispose également du droit d\'introduire une réclamation auprès de la CNDP : 2nd Tour Ihssane, Hay Riad, Rabat — www.cndp.ma',
            'The Data Subject also has the right to lodge a complaint with the CNDP: 2nd Tour Ihssane, Hay Riad, Rabat — www.cndp.ma',
          ),
        },
      ],
    },
    {
      id: 'cookies',
      number: '11',
      title: t('Politique de cookies', 'Cookies policy'),
      blocks: [
        { type: 'p', text: t("Un cookie est un petit fichier déposé sur l'appareil de l'Utilisateur lors de la consultation du Site, permettant de stocker des informations relatives à sa navigation.", 'A cookie is a small file placed on the User\'s device when visiting the Website, allowing information about their browsing to be stored.') },
        { type: 'p', text: t("L'UNM utilise différentes catégories de cookies, classées selon leur finalité :", 'UNM uses different categories of cookies, classified according to their purpose:') },
        {
          type: 'table',
          headers: [t('Catégorie', 'Category'), t('Statut', 'Status'), t('Finalité', 'Purpose')],
          rows: [
            [t('Strictement nécessaires', 'Strictly necessary'), t('Toujours actifs', 'Always active'), t('Navigation, authentification, sécurité.', 'Navigation, authentication, security.')],
            [t("Mesure d'audience", 'Audience measurement'), t('Soumis au consentement', 'Consent required'), t('Statistiques anonymisées de fréquentation.', 'Anonymised visit statistics.')],
            [t('Fonctionnels', 'Functional'), t('Soumis au consentement', 'Consent required'), t('Mémorisation des préférences (langue, accessibilité).', 'Preference memory (language, accessibility).')],
            [t('Personnalisation et marketing', 'Personalisation and marketing'), t('Soumis au consentement', 'Consent required'), t('Contenus pertinents, mesure des campagnes.', 'Relevant content, campaign measurement.')],
            [t('Tiers de réseaux sociaux', 'Third-party social media'), t('Soumis au consentement', 'Consent required'), t('Activés sur interaction (LinkedIn, YouTube).', 'Activated on interaction (LinkedIn, YouTube).')],
          ],
        },
        { type: 'p', text: t("Lors de la première visite, un bandeau de consentement permet à l'Utilisateur d'accepter, de refuser ou de paramétrer finement les cookies non essentiels. L'Utilisateur peut à tout moment modifier ses préférences via le lien « Gérer mes cookies » en bas de chaque page.", 'On the first visit, a consent banner allows the User to accept, decline or fine-tune non-essential cookies. The User can change preferences at any time via the "Manage my cookies" link at the bottom of every page.') },
        { type: 'p', text: t("Les cookies déposés ont une durée de vie maximale de 13 mois. Les données collectées via les cookies sont conservées pendant 25 mois maximum.", 'Cookies have a maximum lifespan of 13 months. Data collected via cookies is kept for a maximum of 25 months.') },
      ],
    },
    {
      id: 'modification',
      number: '12',
      title: t('Modification de la politique', 'Policy modification'),
      blocks: [
        { type: 'p', text: t("L'UNM se réserve le droit de modifier la présente Politique pour l'adapter aux évolutions légales, réglementaires, techniques ou organisationnelles. Les modifications substantielles font l'objet d'une notification claire aux Utilisateurs disposant d'un compte. La version applicable est celle en vigueur à la date de consultation du Site.", 'UNM reserves the right to modify this Policy to adapt it to legal, regulatory, technical or organisational changes. Substantial changes are clearly notified to Users with an account. The applicable version is the one in force at the date of consultation.') },
      ],
    },
    {
      id: 'contact',
      number: '13',
      title: t('Contact', 'Contact'),
      blocks: [
        { type: 'p', text: t("Pour toute question relative à la présente Politique ou au traitement de vos données :", 'For any question concerning this Policy or the processing of your data:') },
        {
          type: 'definitions',
          items: [
            { term: t('Délégué à la Protection des Données', 'Data Protection Officer'), value: t('dpo@unm.ma', 'dpo@unm.ma') },
            { term: t('CNDP', 'CNDP'), value: t('Commission Nationale de contrôle de la Protection des Données — 2nd Tour Ihssane, Hay Riad, Rabat — www.cndp.ma', 'National Commission for the Control of Personal Data Protection — 2nd Tour Ihssane, Hay Riad, Rabat — www.cndp.ma') },
          ],
        },
      ],
    },
  ],
};
