'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

type ContactData = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations('forms');
  const tc = useTranslations('common');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: ContactData) {
    setSubmitError(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    }
  }

  if (submitted) {
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t('firstName')} required {...register('firstName')} error={errors.firstName && t('errorRequired')} />
        <Input label={t('lastName')} required {...register('lastName')} error={errors.lastName && t('errorRequired')} />
      </div>
      <Input label={t('email')} type="email" required {...register('email')} error={errors.email && t('errorEmail')} />
      <Input label={t('phone')} type="tel" {...register('phone')} />
      <Input label={t('subject')} required {...register('subject')} error={errors.subject && t('errorRequired')} />
      <Textarea label={t('message')} required {...register('message')} error={errors.message && t('errorRequired')} />
      {submitError && (
        <p role="alert" className="rounded-xl border border-primary/20 bg-primary-50/80 px-4 py-3 text-sm text-primary-800">
          {t('errorGeneric')}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} size="lg" trailingIcon={<Icon name="send" size={18} />}>
        {tc('submit')}
      </Button>
    </form>
  );
}
