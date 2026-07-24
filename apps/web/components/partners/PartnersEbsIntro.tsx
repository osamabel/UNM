import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@unm/types';

const EBS_WORDMARK = '/partners/ebs/logo-european.svg';

/**
 * Clean EBS presentation block — logo + mission on the left,
 * school portrait on the right. Placed before the UNM × EBS alliance card.
 */
export async function PartnersEbsIntro({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'partnersIndex' });

  return (
    <section className="partners-ebs-intro" aria-label="European Business School">
      <div className="partners-ebs-intro-grid">
        <div className="partners-ebs-intro-left">
          <div className="partners-ebs-intro-logo">
            <Image
              src={EBS_WORDMARK}
              alt="European Business School"
              width={320}
              height={96}
              className="partners-ebs-intro-logo-img"
              priority
            />
          </div>
          <p className="partners-ebs-intro-mission">{t('ebsIntroMission')}</p>
        </div>

        <div className="partners-ebs-intro-right">
          <p className="partners-ebs-intro-body">{t('ebsIntroBody1')}</p>
          <p className="partners-ebs-intro-body">{t('ebsIntroBody2')}</p>
        </div>
      </div>
    </section>
  );
}
