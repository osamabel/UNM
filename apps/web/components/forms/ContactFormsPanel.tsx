'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/forms/ContactForm';
import { CallbackForm } from '@/components/forms/CallbackForm';
import { cn } from '@/lib/utils';

type Tab = 'message' | 'callback';

export function ContactFormsPanel() {
  const t = useTranslations('contact');
  const [tab, setTab] = useState<Tab>('message');

  return (
    <div className="contact-forms">
      <div className="contact-tabs" role="tablist" aria-label={t('formsTabsLabel')}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'message'}
          id="contact-tab-message"
          aria-controls="contact-panel-message"
          className={cn('contact-tab', tab === 'message' && 'is-active')}
          onClick={() => setTab('message')}
        >
          <Icon name="send" size={16} />
          {t('sendMessage')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'callback'}
          id="contact-tab-callback"
          aria-controls="contact-panel-callback"
          className={cn('contact-tab', tab === 'callback' && 'is-active')}
          onClick={() => setTab('callback')}
        >
          <Icon name="phone" size={16} />
          {t('requestCallback')}
        </button>
      </div>

      <div className="contact-forms-panel form-panel">
        {tab === 'message' ? (
          <div
            role="tabpanel"
            id="contact-panel-message"
            aria-labelledby="contact-tab-message"
          >
            <p className="contact-forms-hint">{t('sendMessageHint')}</p>
            <ContactForm />
          </div>
        ) : (
          <div
            role="tabpanel"
            id="contact-panel-callback"
            aria-labelledby="contact-tab-callback"
          >
            <p className="contact-forms-hint">{t('callbackHint')}</p>
            <CallbackForm />
          </div>
        )}
      </div>
    </div>
  );
}
