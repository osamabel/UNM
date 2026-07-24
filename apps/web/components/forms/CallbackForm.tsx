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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Data>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
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
      <div className="contact-form-success">
        <span className="icon-box mx-auto h-14 w-14">
          <Icon name="check-circle" size={28} className="text-primary" />
        </span>
        <p className="mt-4 font-display text-xl text-secondary">{t('thankYou')}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-secondary/60">{tco('callbackSuccessHint')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form-fields" noValidate>
      <Input
        label={tco('name')}
        required
        autoComplete="name"
        placeholder={tco('placeholderFullName')}
        {...register('name')}
        error={errors.name && t('errorRequired')}
      />
      <Input
        label={t('phone')}
        type="tel"
        required
        autoComplete="tel"
        placeholder={tco('placeholderPhone')}
        hint={tco('callbackPhoneHint')}
        {...register('phone')}
        error={errors.phone && t('errorPhone')}
      />
      <Select
        label={tco('preferredSlot')}
        required
        {...register('slot')}
        placeholder={tco('placeholderSlot')}
        options={[
          { value: 'morning', label: tco('slotMorning') },
          { value: 'afternoon', label: tco('slotAfternoon') },
          { value: 'evening', label: tco('slotEvening') },
        ]}
        error={errors.slot && t('errorRequired')}
      />
      {submitError ? (
        <p
          role="alert"
          className="rounded-xl border border-primary/20 bg-primary-50/80 px-4 py-3 text-sm text-primary-800"
        >
          {t('errorGeneric')}
        </p>
      ) : null}
      <div className="contact-form-submit">
        <Button
          type="submit"
          loading={isSubmitting}
          size="lg"
          className="w-full justify-center sm:w-auto"
          trailingIcon={<Icon name="phone" size={18} />}
        >
          {tco('callbackSubmit')}
        </Button>
        <p className="contact-form-submit-hint">{tco('callbackSubmitHint')}</p>
      </div>
    </form>
  );
}
