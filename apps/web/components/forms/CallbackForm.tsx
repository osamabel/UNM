'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+?[0-9\s\-()]{8,15}$/),
  slot: z.enum(['morning', 'afternoon', 'evening']),
});
type Data = z.infer<typeof schema>;

export function CallbackForm() {
  const t = useTranslations('forms');
  const tc = useTranslations('common');
  const tco = useTranslations('contact');
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Data>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: Data) {
    setSubmitError(false);
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setSubmitError(true);
    }
  }

  if (done) {
    return (
      <div className="py-6 text-center sm:py-8">
        <span className="icon-box mx-auto h-14 w-14">
          <Icon name="check-circle" size={28} className="text-primary" />
        </span>
        <p className="mt-4 font-display text-xl text-secondary">{t('thankYou')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label={tco('name')}
        required
        {...register('name')}
        error={errors.name && t('errorRequired')}
      />
      <Input
        label={t('phone')}
        type="tel"
        required
        {...register('phone')}
        error={errors.phone && t('errorPhone')}
      />
      <Select
        label={tco('preferredSlot')}
        required
        {...register('slot')}
        options={[
          { value: 'morning', label: tco('slotMorning') },
          { value: 'afternoon', label: tco('slotAfternoon') },
          { value: 'evening', label: tco('slotEvening') },
        ]}
      />
      {submitError && (
        <p role="alert" className="rounded-xl border border-primary/20 bg-primary-50/80 px-4 py-3 text-sm text-primary-800">
          {t('errorGeneric')}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} size="lg" trailingIcon={<Icon name="phone" size={18} />}>
        {tc('submit')}
      </Button>
    </form>
  );
}
