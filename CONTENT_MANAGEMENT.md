# Guide du contenu — UNM CMS

Ce guide s'adresse à l'équipe communication UNM qui édite le contenu du site via l'admin CMS (Payload). Aucune compétence technique requise.

---

## 1. Se connecter

URL : **https://cms.unm.ma/admin**

Identifiants : fournis par l'équipe technique. Si tu n'en as pas, demande à la direction informatique UNM.

> **Note de sécurité** : ne partage jamais ton mot de passe. Si tu changes de poste, demande à la DSI de désactiver ton compte.

---

## 2. Comprendre la structure

Le menu de gauche regroupe les collections par catégorie :

### Académique
- **Faculties** — Les 4 facultés UNM (Business School + 3 en préparation)
- **Programs** — Les 10 programmes (DBA + 9 MBA), tous rattachés à Business School

### Contenu éditorial
- **Articles** — Les actualités du site
- **Testimonials** — Les témoignages de diplômés
- **Partners** — Les partenaires institutionnels et entreprises

### Admissions
- **Leads** — Demandes d'information et de rappel
- **Applications** — Candidatures complètes (avec CV, diplôme, lettre)

### Médiathèque
- **Media** — Toutes les images, PDF et fichiers uploadés

### Configuration
- **Site Settings** — Coordonnées institutionnelles (téléphone, email, adresses, réseaux sociaux)

### Administration
- **Users** — Comptes admin (réservé à la direction)

---

## 3. Tâches courantes

### 3.1 Modifier un programme existant

1. Menu de gauche → **Programs**
2. Cliquer sur le programme (ex. *MBA Banques & Assurances*)
3. Modifier les champs souhaités :
   - **Title** : titre en FR et en EN (les deux requis)
   - **Vocation** : paragraphe d'intro affiché dans le hero de la page programme
   - **Target Audience** : à qui s'adresse ce programme
   - **Objectives** : liste numérotée des objectifs pédagogiques
   - **Skills** : compétences acquises (puces)
   - **Outcomes** : débouchés de carrière (puces)
   - **Curriculum** : les modules M1 → M12 — chaque module a un *code* (M1), un *titre*, une *description courte*
   - **FAQ** : questions / réponses
   - **Tuition Fee** : montant en MAD, ou laisser vide pour afficher "Sur demande"
4. Tout en bas → **Save**

⏳ Le site se met à jour **dans les 5 minutes** (cache ISR). Si tu veux voir le changement immédiatement, demande à la DSI de faire un "revalidate" sur Vercel.

### 3.2 Publier un article d'actualité

1. **Articles → Create new**
2. **Slug** : un identifiant URL court, sans accents — par exemple `lancement-mba-banques-2026`. Une fois publié, ne le change plus (les liens externes seraient cassés).
3. **Title** : titre en FR et EN
4. **Excerpt** : 2 phrases qui résument (affichées dans la liste des news)
5. **Body** : le contenu de l'article (FR + EN)
6. **Cover Image** : choisir une image depuis la Médiathèque (ou en uploader une nouvelle)
7. **Author → Name** : ton nom
8. **Category** : Campus / Recherche / Partenariats / Événements
9. **Published At** : date de publication (peut être future pour planifier)
10. **Reading Time** : estimation en minutes
11. **Meta Title / Description** : pour le SEO (Google) — important
12. **Save**

L'article apparaît automatiquement sur `/actualites` après 5 minutes.

### 3.3 Ajouter un partenaire

1. **Partners → Create new**
2. **Name** : nom officiel (sera affiché tel quel)
3. **Logo** : upload (SVG préféré pour la netteté, sinon PNG transparent)
4. **URL** : site web du partenaire (optionnel)
5. **Category** : Académique / Industrie / Institutionnel
6. **Save**

Le partenaire apparaît dans la grille `/partenaires` et dans le carrousel de la home.

### 3.4 Modifier les coordonnées institutionnelles

1. **Site Settings** (icône engrenage à gauche)
2. Modifier le téléphone, WhatsApp, email, adresses (Marrakech + Laâyoune), réseaux sociaux
3. **Save**

Effet immédiat sur le footer, la page Contact et toutes les sections de pied de page.

### 3.5 Gérer les leads (demandes de rappel et brochures)

1. **Leads** — liste de toutes les demandes triées par date
2. Cliquer sur une demande pour voir : nom, email, téléphone, programme d'intérêt, source UTM
3. Changer le **Status** : `new` → `contacted` → `qualified` → `enrolled` / `lost`
4. Ajouter des **notes** internes (qui a appelé, quand, conclusion)
5. **Save**

**Export CSV** : ouvrir https://cms.unm.ma/api/leads/export.csv → télécharge toute la base. Pratique pour Excel ou pour intégrer un CRM.

### 3.6 Traiter une candidature

1. **Applications** — liste triée par date de soumission
2. Cliquer pour voir le détail : profil du candidat, programme demandé, **documents joints** (CV, diplôme, lettre de motivation)
3. Télécharger les documents en cliquant dessus
4. Changer le **Status** : `submitted` → `under_review` → `accepted` / `rejected` / `waitlisted`
5. Notes du jury dans **Reviewer Notes**
6. **Save**

---

## 4. Règles éditoriales (à respecter)

### 4.1 Bilinguisme

**Chaque champ texte est en deux langues : FR et EN.**

- Le **français est la langue source** (la version EN doit être fidèle à la française).
- Si tu publies un nouveau programme et que la traduction EN n'est pas prête, **utilise la même valeur dans les deux champs temporairement** plutôt que de laisser le champ EN vide — sinon la page anglaise affichera du français mélangé.

### 4.2 Identité de marque

- Le ton est **institutionnel et sobre**. Pas de superlatifs marketing ("exceptionnel", "incroyable"), pas d'émojis.
- Les noms officiels :
  - "UNM" (jamais "U.N.M.")
  - "Université Numérique du Maroc" (pas "Université Numérique Marocaine")
  - "European Business School" ou "EBS Paris" (avec capitalisation exacte)
- Les couleurs sont gérées automatiquement — ne tente pas de changer la couleur d'une faculté sans valider avec la DSI.

### 4.3 Images

- **SVG** pour les logos (qualité parfaite à toutes les tailles).
- **WebP ou JPEG** pour les photos (taille fichier < 500 KB de préférence).
- Toujours renseigner le champ **Alt text** (texte alternatif) — c'est requis pour l'accessibilité ET le SEO.
- Photos officielles uniquement. Pas de photos stock génériques.

### 4.4 SEO

Pour chaque page que tu crées (article, programme, faculté) :
- **Meta Title** : 50-60 caractères, inclut le mot-clé principal + "| UNM"
- **Meta Description** : 150-160 caractères, résume la page, donne envie de cliquer

Vérifie le rendu Google avec https://www.google.com/search?q=site:unm.ma

---

## 5. Ce que tu ne dois PAS faire

❌ **Modifier les slugs après publication** — casse les liens externes et le référencement.

❌ **Supprimer un programme** s'il a des leads ou des applications attachés — les supprimer en premier ou changer leur statut à `lost`.

❌ **Toucher aux champs `displayOrder`, `isActive`, `isFeatured`** sans en parler à la DSI — ces réglages impactent l'affichage sur la home et la page facultés.

❌ **Uploader des fichiers > 10 MB** — refusé par le système.

❌ **Ajouter de nouvelles facultés** sans concertation avec la direction — la structure est codée pour 4 facultés.

❌ **Mettre des couleurs autres que la palette UNM** : `#B5341A` (rouge), `#3D1A0B` (brun), `#FDFAF7` (background). Pas de bleu, vert, violet, etc.

---

## 6. En cas de problème

| Symptôme | Action |
|---|---|
| "Compte verrouillé après trop de tentatives" | Patienter 5 min ou contacter la DSI |
| Une modification n'apparaît pas sur le site | Patienter 5 min (cache ISR). Si rien après 10 min → DSI |
| Erreur "This relationship field has invalid relationships" | Le champ référence un élément qui a été supprimé. Sélectionner un autre élément. |
| Upload qui échoue | Vérifier que le fichier fait < 10 MB et qu'il est en format autorisé (JPEG/PNG/WebP/SVG/PDF) |
| Le site est en panne | Ce n'est pas le CMS, c'est l'hébergement. Contacter la DSI. |

---

## 7. Glossaire

| Terme | Définition |
|---|---|
| **Slug** | Identifiant URL d'un contenu, par exemple `dba-business-administration` dans `/programmes/dba-business-administration` |
| **CMS** | Content Management System — le back-office (ici Payload) où tu édites le contenu |
| **ISR** | Incremental Static Regeneration — la stratégie de cache qui rafraîchit les pages publiques toutes les 5 min |
| **SEO** | Search Engine Optimization — l'optimisation pour Google |
| **Lead** | Prospect qui a manifesté un intérêt (demande de brochure, callback) |
| **Application** | Candidature complète avec dossier (CV + diplôme + lettre) |
| **Locale** | Langue d'affichage (`fr` ou `en`) |

---

Bon édito. Pour toute question éditoriale ou doute sur une convention, n'hésite pas à demander à la direction de la communication UNM.
