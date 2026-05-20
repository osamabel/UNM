'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+?[0-9\s\-()]{8,15}$/),
  slot: z.enum(['morning', 'afternoon', 'evening']),
});
type Data = z.infer<typeof schema>;

export function CallbackForm() {
  const t = useTranslations('forms');
  const tc = useTranslations('common');
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Data>({
    resolver: zodResolver(schema),
  });
  async function onSubmit(data: Data) {
    const res = await fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) setDone(true);
  }
  if (done) {
    return (
      <div className="rounded-card bg-primary-50 p-6 text-center">
        <p className="font-heading text-secondary">{t('thankYou')}</p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input label="Nom" required {...register('name')} error={errors.name && t('errorRequired')} />
      <Input label={t('phone')} type="tel" required {...register('phone')} error={errors.phone && t('errorPhone')} />
      <Select
        label="Créneau préféré"
        required
        {...register('slot')}
        options={[
          { value: 'morning', label: 'Matin' },
          { value: 'afternoon', label: 'Après-midi' },
          { value: 'evening', label: 'Soir' },
        ]}
      />
      <Button type="submit" loading={isSubmitting}>{tc('submit')}</Button>
    </form>
  );
}
