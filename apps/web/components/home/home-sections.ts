/**
 * Home page section order and anchors.
 * Flow: hook (+ stats) → partnership → offerings → faculties → voices → ecosystem → apply
 */
export const HOME_SECTIONS = [
  { id: 'hero', component: 'HeroSection' as const },
  { id: 'partenariat', component: 'EBSPartnership' as const },
  { id: 'programmes', component: 'FeaturedPrograms' as const },
  { id: 'facultes', component: 'FacultyGrid' as const },
  { id: 'temoignages', component: 'TestimonialsSlider' as const },
  { id: 'partenaires', component: 'PartnerLogos' as const },
  { id: 'candidater', component: 'CTABanner' as const },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]['id'];
