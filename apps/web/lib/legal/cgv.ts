import type { LegalDocument } from './types';

const t = (fr: string, en: string) => ({ fr, en });

export const cgv: LegalDocument = {
  key: 'cgv',
  href: { fr: '/cgv', en: '/en/terms-of-sale' },
  shortLabel: t('Conditions de vente', 'Terms of Sale'),
  title: t('Conditions générales de vente', 'General Terms and Conditions of Sale'),
  metaTitle: t(
    'Conditions générales de vente | Université Numérique du Maroc',
    'Terms of Sale | Université Numérique du Maroc',
  ),
  metaDescription: t(
    "Conditions générales de vente de l'UNM : modalités de candidature, frais, paiement, droit de rétractation et juridiction applicable.",
    'UNM general terms of sale: application process, fees, payment, right of withdrawal and governing law.',
  ),
  lastUpdated: '2026-05-17',
  intro: t(
    "Les présentes Conditions Générales de Vente régissent les relations contractuelles entre l'Université Numérique du Maroc et toute personne souhaitant déposer une candidature à l'un de ses programmes, conformément au droit marocain en vigueur, notamment la loi n° 31-08 édictant des mesures de protection du consommateur.",
    'These General Terms and Conditions of Sale govern the contractual relationship between Université Numérique du Maroc and any person wishing to apply to one of its programmes, in accordance with applicable Moroccan law, in particular Law No. 31-08 on consumer protection.',
  ),
  sections: [
    {
      id: 'preambule',
      number: '00',
      title: t('Préambule', 'Preamble'),
      blocks: [
        { type: 'p', text: t("L'UNM s'adresse à un public panafricain de dirigeants, cadres et professionnels. Les présentes CGV sont rédigées en français, langue de référence. Toute traduction est fournie à titre indicatif. En cas de divergence, la version française fait foi.", 'UNM serves a pan-African audience of executives, managers and professionals. These Terms are drafted in French, the reference language. Any translation is provided for convenience. In case of discrepancy, the French version prevails.') },
        { type: 'p', text: t("Le dépôt d'une candidature en ligne emporte acceptation sans réserve des présentes CGV. Le Candidat est invité à les lire attentivement avant tout paiement.", 'Submitting an online application constitutes unreserved acceptance of these Terms. Applicants are invited to read them carefully before any payment.') },
      ],
    },
    {
      id: 'definitions',
      number: '01',
      title: t('Définitions', 'Definitions'),
      blocks: [
        {
          type: 'definitions',
          items: [
            { term: t('Le Prestataire', 'The Provider'), value: t("L'Université Numérique du Maroc (UNM), identifiée aux mentions légales du Site.", 'Université Numérique du Maroc (UNM), identified in the Legal Notice.') },
            { term: t('Le Candidat', 'The Applicant'), value: t("Toute personne physique majeure souhaitant déposer une candidature à l'un des programmes de l'UNM.", "Any individual of legal age wishing to apply to one of UNM's programmes.") },
            { term: t('La Prestation', 'The Service'), value: t("Le processus de sélection mis en œuvre par l'UNM pour évaluer la candidature : traitement administratif, examen pédagogique, entretien éventuel et délibération de la commission d'admission.", 'The selection process implemented by UNM: administrative processing, academic review, interview where applicable, and admissions committee decision.') },
            { term: t('Frais de Candidature', 'Application Fees'), value: t('Somme versée par le Candidat au titre de la Prestation, à l\'exclusion des frais de scolarité.', 'Amount paid by the Applicant for the Service, excluding tuition fees.') },
            { term: t('Frais de Scolarité', 'Tuition Fees'), value: t('Sommes dues par le Candidat admis pour suivre le programme choisi, faisant l\'objet d\'un contrat distinct.', 'Amounts due by admitted Applicants to attend the chosen programme, subject to a separate contract.') },
          ],
        },
      ],
    },
    {
      id: 'objet',
      number: '02',
      title: t('Objet', 'Purpose'),
      blocks: [
        { type: 'p', text: t("Les présentes CGV ont pour objet de définir les conditions dans lesquelles l'UNM met en œuvre la procédure de candidature et perçoit les Frais de Candidature correspondants.", 'These Terms define the conditions under which UNM implements the application procedure and collects the corresponding Application Fees.') },
        { type: 'p', text: t("Elles ne couvrent pas l'inscription définitive au programme, qui fait l'objet d'un contrat d'enseignement ou d'une convention de formation spécifique signée après admission.", 'They do not cover the final enrolment in the programme, which is governed by a separate teaching contract or training agreement signed after admission.') },
      ],
    },
    {
      id: 'candidature',
      number: '03',
      title: t('Formalités de candidature', 'Application process'),
      blocks: [
        { type: 'p', text: t('Le Candidat dépose son dossier en ligne via le formulaire dédié sur le Site. Pour être recevable, le dossier doit comporter l\'ensemble des pièces justificatives requises selon le programme visé :', 'Applicants submit their file online via the dedicated form on the Website. To be admissible, the file must include all supporting documents required for the chosen programme:') },
        {
          type: 'list',
          items: [
            t('Pièce d\'identité en cours de validité (CIN, passeport ou titre de séjour).', 'Valid ID document (national ID, passport or residence permit).'),
            t('Curriculum vitae à jour.', 'Up-to-date résumé.'),
            t('Lettre de motivation.', 'Cover letter.'),
            t('Copies des diplômes et relevés de notes.', 'Copies of degrees and academic transcripts.'),
            t('Justificatifs d\'expérience professionnelle.', 'Evidence of professional experience.'),
            t('Photographie d\'identité récente.', 'Recent ID photograph.'),
            t('Tout document spécifique exigé par le programme choisi.', 'Any specific document required by the chosen programme.'),
          ],
        },
        {
          type: 'callout',
          text: t(
            "L'admission relève de la seule appréciation de la commission d'admission de l'UNM. Le paiement des Frais de Candidature ne préjuge en aucun cas de l'issue de la sélection.",
            "Admission decisions are at the sole discretion of UNM's admissions committee. Payment of Application Fees does not in any way prejudge the outcome of the selection.",
          ),
        },
      ],
    },
    {
      id: 'prix',
      number: '04',
      title: t('Prix des frais de candidature', 'Application fee amount'),
      blocks: [
        { type: 'p', text: t("Le montant des Frais de Candidature est précisé sur la page d'admission du programme concerné, en dirhams marocains (MAD), TTC. Pour les candidats résidant hors du Maroc, le Candidat est responsable des éventuels frais bancaires, de change ou commissions appliqués par sa banque émettrice.", 'The Application Fee amount is shown on the admission page of the relevant programme, in Moroccan Dirhams (MAD), including tax. For applicants residing outside Morocco, the Applicant is responsible for any banking, currency exchange or commission fees charged by their issuing bank.') },
        { type: 'p', text: t("Ces frais correspondent à la participation du Candidat aux coûts de traitement de son dossier : vérification administrative, instruction pédagogique, entretien si admissibilité, et délibération de la commission de recrutement. Le taux de TVA applicable est celui en vigueur à la date du paiement.", 'These fees cover the Applicant\'s contribution to the costs of processing the file: administrative verification, academic review, interview where applicable, and admissions committee decision. The applicable VAT rate is the one in force at the date of payment.') },
      ],
    },
    {
      id: 'paiement',
      number: '05',
      title: t('Modalités de paiement', 'Payment terms'),
      blocks: [
        { type: 'p', text: t("Le paiement des Frais de Candidature s'effectue exclusivement en ligne, par carte bancaire, au moment du dépôt de la candidature. Le règlement est opéré via une plateforme sécurisée partenaire, agréée et conforme à la norme PCI-DSS.", 'Payment of the Application Fees is made exclusively online, by credit or debit card, at the time of application submission. Payment is processed via a secure authorised partner platform compliant with PCI-DSS.') },
        { type: 'p', text: t("Sont acceptées les cartes bancaires nationales et internationales (Visa, Mastercard, et autres réseaux conventionnés). L'UNM n'a à aucun moment accès aux coordonnées bancaires du Candidat, qui sont traitées exclusivement par le prestataire de paiement.", 'Accepted cards include national and international cards (Visa, Mastercard, and other partner networks). UNM has no access at any time to the Applicant\'s banking details, which are processed exclusively by the payment provider.') },
        {
          type: 'callout',
          text: t("Aucun dossier ne sera traité tant que le paiement n'aura pas été effectivement encaissé.", 'No file will be processed until payment has been effectively received.'),
        },
      ],
    },
    {
      id: 'preuve',
      number: '06',
      title: t('Preuve de la transaction', 'Proof of transaction'),
      blocks: [
        { type: 'p', text: t("Le prestataire de paiement délivre au Candidat, à l'issue de la transaction, un justificatif électronique téléchargeable. L'UNM adresse en complément un courriel de confirmation valant accusé de réception du dossier de candidature. Ces documents constituent la preuve de la transaction entre les parties.", 'The payment provider issues the Applicant a downloadable electronic receipt upon completion of the transaction. UNM also sends a confirmation email acting as acknowledgement of the application file. These documents constitute proof of the transaction.') },
      ],
    },
    {
      id: 'retractation',
      number: '07',
      title: t('Droit de rétractation', 'Right of withdrawal'),
      blocks: [
        { type: 'lead', text: t("Conformément à l'article 36 de la loi marocaine n° 31-08, le Candidat dispose d'un délai de sept (7) jours à compter de la date de paiement pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à supporter de pénalités.", 'In accordance with Article 36 of Moroccan Law No. 31-08, the Applicant has a period of seven (7) days from the date of payment to exercise their right of withdrawal, without justification or penalty.') },
        { type: 'p', text: t("Pour exercer ce droit, le Candidat doit notifier à l'UNM sa décision, avant l'expiration du délai, par courriel adressé au service candidatures avec accusé de réception, ou par courrier recommandé adressé au siège de l'UNM.", 'To exercise this right, the Applicant must notify UNM of their decision before the deadline, by email to the admissions service with acknowledgement of receipt, or by registered mail to UNM\'s registered office.') },
        {
          type: 'callout',
          text: t(
            "Le droit de rétractation ne peut plus être exercé à compter du moment où l'instruction du dossier a effectivement débuté, conformément à l'article 37 de la loi n° 31-08 relatif aux services dont l'exécution a commencé avec l'accord du consommateur. À compter de cette transmission, aucun remboursement ne sera effectué, quelle que soit l'issue de la candidature.",
            'The right of withdrawal can no longer be exercised once the file review has actually begun, in accordance with Article 37 of Law No. 31-08 relating to services whose execution has begun with the consumer\'s consent. From that point on, no refund will be made, regardless of the outcome of the application.',
          ),
        },
        { type: 'p', text: t("En cas de rétractation valablement exercée, le remboursement intervient dans un délai maximum de trente (30) jours à compter de la réception de la notification, par le moyen de paiement utilisé lors de la transaction initiale.", 'In the event of valid withdrawal, the refund is made within a maximum of thirty (30) days from receipt of the notification, using the same payment method as the initial transaction.') },
      ],
    },
    {
      id: 'donnees',
      number: '08',
      title: t('Protection des données personnelles', 'Personal data protection'),
      blocks: [
        { type: 'p', text: t("L'UNM, en sa qualité de responsable de traitement, met en œuvre des traitements de données personnelles dans le cadre du processus de candidature, conformément à la loi marocaine n° 09-08 et aux décisions de la CNDP.", 'UNM, as data controller, processes personal data within the application process, in accordance with Moroccan Law No. 09-08 and the decisions of the CNDP.') },
        { type: 'p', text: t("Pour les Candidats admis : les données sont conservées pendant la durée du programme, augmentée d'une durée de dix (10) ans à compter de la délivrance du diplôme. Pour les Candidats non admis : les données sont conservées pendant deux (2) ans à compter de la décision finale, sauf opposition.", 'For admitted Applicants: data is kept for the duration of the programme plus ten (10) years from diploma issuance. For unsuccessful Applicants: data is kept for two (2) years from the final decision, unless opposition is exercised.') },
        { type: 'p', text: t("Le détail des traitements et l'usage des cookies sont précisés dans la Politique de protection des données et des cookies.", 'Detailed processing terms and cookie usage are set out in the Data Protection and Cookies Policy.') },
      ],
    },
    {
      id: 'force-majeure',
      number: '09',
      title: t('Force majeure', 'Force majeure'),
      blocks: [
        { type: 'p', text: t("Sont considérés comme cas de force majeure les événements présentant un caractère imprévisible, irrésistible et extérieur aux parties, conformément à l'article 269 du Dahir formant Code des obligations et des contrats (DOC) marocain : catastrophes naturelles, épidémies et pandémies déclarées, conflits armés, troubles civils, décisions des autorités publiques, interruptions généralisées des réseaux de télécommunication et d'électricité.", 'Force majeure events are those that are unforeseeable, irresistible and external to the parties, in accordance with Article 269 of the Moroccan Dahir on Obligations and Contracts (DOC): natural disasters, declared epidemics or pandemics, armed conflicts, civil unrest, decisions by public authorities, widespread interruptions of telecommunications and electricity networks.') },
        { type: 'p', text: t("Si la force majeure se prolonge au-delà d'un mois, chacune des parties pourra résilier les présentes sans indemnité.", 'If force majeure extends beyond one month, either party may terminate these Terms without compensation.') },
      ],
    },
    {
      id: 'propriete',
      number: '10',
      title: t('Propriété intellectuelle', 'Intellectual property'),
      blocks: [
        { type: 'p', text: t("L'ensemble des éléments du Site et des supports fournis dans le cadre de la candidature est protégé par la loi marocaine n° 2-00. Ces éléments sont la propriété exclusive de l'UNM ou de ses partenaires, notamment European Business School.", 'All elements of the Website and materials provided during the application process are protected under Moroccan Law No. 2-00. These elements are the exclusive property of UNM or its partners, notably European Business School.') },
        { type: 'p', text: t("L'UNM concède au Candidat une licence d'utilisation strictement personnelle, non exclusive et non cessible, pour l'accès au Site et aux supports fournis dans le cadre de sa candidature.", 'UNM grants the Applicant a strictly personal, non-exclusive and non-transferable licence to access the Website and materials provided during the application process.') },
      ],
    },
    {
      id: 'responsabilite',
      number: '11',
      title: t('Responsabilité', 'Liability'),
      blocks: [
        { type: 'p', text: t("L'UNM met en œuvre les diligences raisonnables pour assurer le bon fonctionnement du Site et la confidentialité des données traitées. L'UNM ne peut être tenue pour responsable des interruptions ou indisponibilités du Site liées à des causes indépendantes de sa volonté, des dommages indirects, ou des fraudes liées à l'usage non autorisé des moyens de paiement du Candidat.", 'UNM takes reasonable diligence to ensure the proper functioning of the Website and the confidentiality of processed data. UNM cannot be held liable for interruptions or unavailability due to causes beyond its control, indirect damages, or fraud relating to unauthorised use of the Applicant\'s payment methods.') },
        { type: 'p', text: t("Le Candidat est seul responsable de l'exactitude des informations qu'il communique. Toute déclaration mensongère ou frauduleuse entraîne l'annulation immédiate de la candidature, sans remboursement, sans préjudice des poursuites judiciaires éventuelles.", 'The Applicant is solely responsible for the accuracy of the information they provide. Any false or fraudulent statement results in the immediate cancellation of the application without refund, without prejudice to any legal action.') },
      ],
    },
    {
      id: 'loi-juridiction',
      number: '12',
      title: t('Loi applicable et juridiction', 'Governing law and jurisdiction'),
      blocks: [
        { type: 'p', text: t("Les présentes CGV sont régies par le droit marocain. En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, le litige sera soumis à la compétence exclusive des tribunaux du ressort du siège.", 'These Terms are governed by Moroccan law. In case of dispute, the parties shall seek an amicable solution. Failing that, the dispute will be submitted to the exclusive jurisdiction of the courts of the registered office district.') },
        { type: 'p', text: t("Les Candidats résidant hors du Maroc reconnaissent expressément la compétence des juridictions marocaines pour tout différend relatif aux présentes CGV.", 'Applicants residing outside Morocco expressly acknowledge the jurisdiction of Moroccan courts for any dispute relating to these Terms.') },
      ],
    },
    {
      id: 'contact',
      number: '13',
      title: t('Contact', 'Contact'),
      blocks: [
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
