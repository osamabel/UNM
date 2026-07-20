import { BrandLoader } from '@/components/shared/BrandLoader';

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center py-16">
      <BrandLoader label="Chargement…" />
    </div>
  );
}
