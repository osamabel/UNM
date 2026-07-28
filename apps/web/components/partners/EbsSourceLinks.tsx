'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { EBS_EXTERNAL_LINKS } from '@/lib/ebs-external-links';
import { LOGO_SRC } from '@/lib/logo';
import { cn } from '@/lib/utils';

const EBS_MARK = '/partners/ebs/logo-european.svg';
const PREVIEW_BG = '/partners/ebs/alliance-collage.jpg';

interface Props {
  variant?: 'home' | 'panel';
  className?: string;
}

export function EbsSourceLinks({ variant = 'home', className }: Props) {
  const t = useTranslations('ebs');

  return (
    <div className={cn('ebs-sources', `ebs-sources--${variant}`, className)}>
      <div className="ebs-sources-head">
        <p className="ebs-sources-eyebrow">{t('externalLinksLabel')}</p>
        <h3 className="ebs-sources-title">{t('externalLinksTitle')}</h3>
        <p className="ebs-sources-lead">{t('externalLinksLead')}</p>
      </div>

      <ul className="ebs-sources-list">
        {EBS_EXTERNAL_LINKS.map((link) => (
          <li key={link.href} className="ebs-source-item">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'ebs-source-browser-card',
                `ebs-source-browser-card--${link.previewTone}`,
              )}
            >
              <span className="ebs-source-browser-bar">
                <span className="ebs-source-browser-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="ebs-source-browser-url">
                  <Icon name="globe" size={12} />
                  ebs-paris.fr
                </span>
              </span>

              <span className="ebs-source-browser-stage">
                <Image
                  src={PREVIEW_BG}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="ebs-source-browser-bg"
                />
                <span className="ebs-source-browser-scrim" aria-hidden />

                <span className="ebs-source-browser-brand" aria-hidden>
                  <span className="ebs-source-browser-logo-slot">
                    <Image
                      src={EBS_MARK}
                      alt=""
                      width={140}
                      height={56}
                      className="ebs-source-browser-logo ebs-source-browser-logo--ebs"
                    />
                  </span>
                  <span className="ebs-source-browser-logo-x">×</span>
                  <span className="ebs-source-browser-logo-slot">
                    <Image
                      src={LOGO_SRC}
                      alt=""
                      width={140}
                      height={56}
                      className="ebs-source-browser-logo ebs-source-browser-logo--unm"
                    />
                  </span>
                </span>

                <span className="ebs-source-browser-body">
                  <span className="ebs-source-browser-kicker">{t(link.kindKey)}</span>
                  <span className="ebs-source-browser-title">{t(link.labelKey)}</span>
                  <span className="ebs-source-browser-teaser">{t(link.previewKey)}</span>
                  <span className="ebs-source-browser-cta">
                    {t('externalPreviewCta')}
                    <Icon name="arrow-right" size={14} className="btn-arrow" />
                  </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
