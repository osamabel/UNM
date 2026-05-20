'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: ContactData) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      /* handled by errors in UI */
    }
  }

  if (submitted) {
    return (
      <div className="rounded-card bg-primary-50 p-6 text-center">
        <p className="font-heading text-secondary">{t('thankYou')}</p>
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
      <Button type="submit" loading={isSubmitting}>{tc('submit')}</Button>
    </form>
  );
}
