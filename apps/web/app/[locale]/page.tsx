import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@unm/types';
import { HeroSection } from '@/components/home/HeroSection';
import { EBSPartnership } from '@/components/home/EBSPartnership';
import { FacultyGrid } from '@/components/home/FacultyGrid';
import { FeaturedPrograms } from '@/components/home/FeaturedPrograms';
import { PartnerLogos } from '@/components/home/PartnerLogos';
import { TestimonialsSlider } from '@/components/home/TestimonialsSlider';
import { CTABanner } from '@/components/home/CTABanner';
import {
  getFaculties,
  getPartners,
  getTestimonials,
} from '@/lib/api';

export const revalidate = 60;

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [faculties, partners, testimonials] = await Promise.all([
    getFaculties(),
    getPartners(),
    getTestimonials(),
  ]);

  return (
    <div className="home-page flex flex-col">
      <HeroSection />
      <EBSPartnership partners={partners} />
      <FeaturedPrograms />
      <FacultyGrid faculties={faculties} />
      <PartnerLogos partners={partners} />
      <TestimonialsSlider testimonials={testimonials} />
      <CTABanner />
    </div>
  );
}
