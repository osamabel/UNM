import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@unm/types';
import { HeroSection } from '@/components/home/HeroSection';
import { EBSPartnership } from '@/components/home/EBSPartnership';
import { FacultyGrid } from '@/components/home/FacultyGrid';
import { FeaturedPrograms } from '@/components/home/FeaturedPrograms';
import { TestimonialsSlider } from '@/components/home/TestimonialsSlider';
import { PartnerLogos } from '@/components/home/PartnerLogos';
import { CTABanner } from '@/components/home/CTABanner';
import {
  getFaculties,
  getPartners,
  getPrograms,
  getTestimonials,
} from '@/lib/api';

export const revalidate = 300;

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [faculties, programs, testimonials, partners] = await Promise.all([
    getFaculties(),
    getPrograms({ featured: true, limit: 3 }),
    getTestimonials(),
    getPartners(),
  ]);

  return (
    <div className="home-page flex flex-col">
      <HeroSection />
      <EBSPartnership />
      <FeaturedPrograms programs={programs} />
      <FacultyGrid faculties={faculties} />
      <TestimonialsSlider testimonials={testimonials} />
      <PartnerLogos partners={partners} />
      <CTABanner />
    </div>
  );
}
