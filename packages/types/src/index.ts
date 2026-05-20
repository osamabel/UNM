// ════════════════════════════════════════════════════════════════
// Shared TypeScript contracts for the UNM website.
// Source of truth for both Payload CMS collections (apps/cms)
// and the Next.js frontend (apps/web).
// Bilingual only — FR (primary) + EN (secondary). No Arabic, no RTL.
// ════════════════════════════════════════════════════════════════

export type Locale = 'fr' | 'en';

export interface LocalizedField {
  fr: string;
  en: string;
}

export interface Media {
  id: string;
  url: string;
  alt: string;
  filename: string;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface Faculty {
  id: string;
  slug: string;
  /** Lower numbers appear first in faculty lists/grids. */
  displayOrder: number;
  name: LocalizedField;
  description: LocalizedField;
  icon: string;
  color: string;
  /**
   * When true the faculty is announced but not yet operational — rendered as
   * a non-clickable card with a "Bientôt" badge and no detail page.
   */
  comingSoon?: boolean;
  /** Disciplinary domains covered by the faculty (editorial copy). */
  domains?: LocalizedField[];
  programs?: Program[];
  /**
   * Number of active programmes attached to this faculty.
   * Computed by the API layer (not stored in the CMS).
   */
  programCount?: number;
  outcomes: LocalizedField[];
  strengths: LocalizedField[];
  coverImage: Media;
  metaTitle: LocalizedField;
  metaDescription: LocalizedField;
  createdAt: string;
  updatedAt: string;
}

export type ProgramType = 'DBA' | 'MBA' | 'Bachelor' | 'Certificate';
export type ProgramFormat = 'Présentiel' | 'Distanciel' | 'Hybride';
export type ProgramLanguage = 'fr' | 'en';

export interface ProgramFAQItem {
  question: LocalizedField;
  answer: LocalizedField;
}

/**
 * One module / seminar of a programme curriculum.
 * `group` is an optional editorial grouping (e.g. "Première année",
 * "Deuxième année") — when empty the modules are not grouped on the page.
 */
export interface CurriculumModule {
  code: string;
  title: LocalizedField;
  description: LocalizedField;
  group?: LocalizedField | string;
}

export interface Program {
  id: string;
  slug: string;
  title: LocalizedField;
  type: ProgramType;
  faculty: Faculty;
  duration: string;
  format: ProgramFormat;
  language: ProgramLanguage[];
  schedule: LocalizedField;
  admissionRequirements: LocalizedField;
  /** Editorial intro paragraph displayed in the programme hero. */
  vocation?: LocalizedField;
  targetAudience: LocalizedField;
  objectives: LocalizedField[];
  skills: LocalizedField[];
  /** Narrative description of skills (long-form, in addition to bullets). */
  skillsNarrative?: LocalizedField;
  outcomes: LocalizedField[];
  /** Narrative description of career outlooks (long-form, in addition to bullets). */
  careerOutlooks?: LocalizedField;
  curriculum?: CurriculumModule[];
  tuitionFee: number | null;
  faq: ProgramFAQItem[];
  brochureFile: Media;
  startDate: string;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle: LocalizedField;
  metaDescription: LocalizedField;
  createdAt: string;
  updatedAt: string;
}

export type ArticleCategory =
  | 'campus'
  | 'recherche'
  | 'partenariats'
  | 'evenements';

export interface Article {
  id: string;
  slug: string;
  title: LocalizedField;
  excerpt: LocalizedField;
  body: LocalizedField;
  coverImage: Media;
  author: { name: string; bio?: LocalizedField; avatar?: Media };
  category: ArticleCategory;
  publishedAt: string;
  readingTime: number;
  metaTitle: LocalizedField;
  metaDescription: LocalizedField;
}

export interface Testimonial {
  id: string;
  quote: LocalizedField;
  authorName: string;
  authorRole: LocalizedField;
  program?: Program;
  graduationYear?: number;
  avatar?: Media;
}

export interface Partner {
  id: string;
  name: string;
  logo: Media;
  url?: string;
  category: 'academic' | 'industry' | 'government';
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'enrolled' | 'lost';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programInterest: Program;
  source: string;
  medium: string;
  campaign: string;
  status: LeadStatus;
  consentGiven: boolean;
  consentTimestamp: string;
  createdAt: string;
  notes: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'waitlisted';

export interface Application {
  id: string;
  lead: Lead;
  program: Program;
  status: ApplicationStatus;
  documents: Media[];
  submittedAt: string;
  reviewedAt: string | null;
  reviewerNotes: string;
}

export interface SiteSettings {
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: LocalizedField;
  };
  social: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  legal: {
    legalNotice: LocalizedField;
    privacyPolicy: LocalizedField;
  };
}

export const FACULTY_COLORS = {
  management: '#B5341A',
  digital: '#8B2712',
  governance: '#3D1A0B',
  health: '#CE4B2A',
} as const;
