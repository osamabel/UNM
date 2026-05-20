import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgramFilter } from '@/components/shared/ProgramFilter';
import { getFaculties, getPrograms } from '@/lib/api';
import { localized, programPath } from '@/lib/utils';
import type { Locale } from '@unm/types';

export const revalidate = 120;

interface Search {
  faculty?: string;
  type?: string;
  format?: string;
  language?: string;
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: params.locale === 'en' ? 'Programs' : 'Programmes' };
}

export default async function ProgramsIndex({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: Search;
}) {
  unstable_setRequestLocale(params.locale);
  const [faculties, programs] = await Promise.all([
    getFaculties(),
    getPrograms(searchParams),
  ]);
  return (
    <>
      <Breadcrumb
        items={[
          { name: params.locale === 'en' ? 'Home' : 'Accueil', url: params.locale === 'en' ? '/en' : '/' },
          { name: params.locale === 'en' ? 'Programs' : 'Programmes', url: params.locale === 'en' ? '/en/programs' : '/programmes' },
        ]}
      />
      <SectionWrapper>
        <h1 className="font-display text-display-lg text-secondary">
          {params.locale === 'en' ? 'All programs' : 'Tous les programmes'}
        </h1>
        <div className="mt-8">
          <ProgramFilter
            faculties={faculties.map((f) => ({
              slug: f.slug,
              name: localized(f.name, params.locale),
            }))}
          />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Link key={p.id} href={programPath(p.slug, params.locale)}>
              <Card interactive className="p-6 h-full">
                <Badge variant="program-type" type={p.type}>{p.type}</Badge>
                <h2 className="mt-3 font-display text-xl text-secondary line-clamp-2">
                  {localized(p.title, params.locale)}
                </h2>
                <p className="mt-3 text-sm text-secondary-400">
                  {p.duration} · {p.format}
                </p>
              </Card>
            </Link>
          ))}
        </div>
        {programs.length === 0 && (
          <p className="mt-12 text-center text-secondary-400">
            {params.locale === 'en' ? 'No program matches these filters.' : 'Aucun programme ne correspond à ces filtres.'}
          </p>
        )}
      </SectionWrapper>
    </>
  );
}
