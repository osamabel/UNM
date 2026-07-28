"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ScrollReveal } from "@/components/patterns/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { EbsSourceLinks } from "@/components/partners/EbsSourceLinks";
import {
  getEbsAllianceLockup,
  type AllianceLogoEntry,
} from "@/lib/partner-logos";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { getBrandLogoSrc } from "@/lib/site-settings";
import { cn } from "@/lib/utils";
import type { Locale, Partner } from "@unm/types";

const PILLARS = [
  { key: "pillar1" as const, num: "01" },
  { key: "pillar2" as const, num: "02" },
  { key: "pillar3" as const, num: "03" },
];

const ACCREDITATIONS = [
  {
    id: "cge",
    src: "/partners/ebs/accreditations/cge.png",
    name: "Conférence des Grandes Écoles",
  },
  {
    id: "cefdg",
    src: "/partners/ebs/accreditations/cefdg.png",
    name: "CEFDG",
  },
  {
    id: "cdefm",
    src: "/partners/ebs/accreditations/cdefm.png",
    name: "CDEFM",
  },
  {
    id: "efmd",
    src: "/partners/ebs/accreditations/efmd.png",
    name: "EFMD Accredited",
  },
  {
    id: "aacsb",
    src: "/partners/ebs/accreditations/aacsb.png",
    name: "AACSB Business Education Alliance",
  },
] as const;

function AllianceLogoMark({
  entry,
  side,
}: {
  entry: AllianceLogoEntry;
  side: "unm" | "ebs";
}) {
  if (!entry.src) {
    return (
      <div className={cn("alliance-mark", `alliance-mark--${side}`)}>
        <span className="alliance-mark-fallback">{entry.name}</span>
      </div>
    );
  }

  const fromCms = entry.src.startsWith("/cms-media/");

  return (
    <div
      className={cn("alliance-mark", `alliance-mark--${side}`)}
      style={{ ["--logo-scale" as string]: entry.scale }}
    >
      <Image
        src={entry.src}
        alt={entry.name}
        width={480}
        height={180}
        sizes="(max-width: 640px) 40vw, 200px"
        quality={95}
        unoptimized={fromCms}
        className="alliance-mark-img"
        priority
      />
    </div>
  );
}

export function EBSPartnership({ partners = [] }: { partners?: Partner[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("ebs");
  const settings = useSiteSettings();
  const programsHref = locale === "en" ? "/en/programs" : "/programmes";
  const partnersHref = locale === "en" ? "/en/partners" : "/partenaires";
  const [unm, ebs] = getEbsAllianceLockup(partners, getBrandLogoSrc(settings));

  return (
    <SectionWrapper
      id="partenariat"
      tone="canvas"
      className="alliance-section !pb-14 !pt-12 sm:!pb-16 sm:!pt-14 lg:!pb-20 lg:!pt-16"
    >
      <div
        className="alliance-glow pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative grid min-w-0 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <ScrollReveal className="lg:col-span-5" from="left" duration={950}>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden />
            <p className="eyebrow !mt-0">{t("eyebrow")}</p>
          </div>

          <h2 className="alliance-title mt-4">
            <span className="text-primary">UNM</span>
            <span className="alliance-title-x" aria-hidden>
              ×
            </span>
            <span>EBS Paris</span>
          </h2>

          <p className="alliance-lead mt-5 max-w-md">{t("description")}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={programsHref}
              className="btn-uni btn-uni-primary inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm"
            >
              {t("learnMore")}
              <Icon name="arrow-right" size={16} className="btn-arrow" />
            </Link>
            <Link
              href={partnersHref}
              className="btn-uni btn-uni-ghost inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm"
            >
              {t("partnersLink")}
            </Link>
          </div>
        </ScrollReveal>

        <div className="lg:col-span-7" aria-label={t("title")}>
          <div className="alliance-stage">
            <div
              className="alliance-stage-orb alliance-stage-orb--a"
              aria-hidden
            />
            <div
              className="alliance-stage-orb alliance-stage-orb--b"
              aria-hidden
            />

            <div className="alliance-duo">
              <ScrollReveal
                delay={40}
                from="scale"
                className="alliance-duo-cell"
              >
                <div className="alliance-sphere-wrap alliance-sphere-wrap--a">
                  <span className="alliance-ring" aria-hidden />
                  <div className="alliance-sphere alliance-sphere--unm">
                    <div className="alliance-sphere-spin" aria-hidden>
                      <span className="alliance-sphere-band" />
                      <span className="alliance-sphere-shine" />
                    </div>
                    <AllianceLogoMark entry={unm} side="unm" />
                  </div>
                  <span className="alliance-sphere-shadow" aria-hidden />
                </div>
              </ScrollReveal>

              <ScrollReveal
                delay={140}
                from="scale"
                className="alliance-duo-join"
              >
                <div className="alliance-bridge" aria-hidden>
                  <span className="alliance-bridge-line" />
                  <span className="alliance-lockup-x">×</span>
                  <span className="alliance-bridge-line" />
                </div>
              </ScrollReveal>

              <ScrollReveal
                delay={220}
                from="scale"
                className="alliance-duo-cell"
              >
                <div className="alliance-sphere-wrap alliance-sphere-wrap--b">
                  <span
                    className="alliance-ring alliance-ring--ebs"
                    aria-hidden
                  />
                  <div className="alliance-sphere alliance-sphere--ebs">
                    <div
                      className="alliance-sphere-spin alliance-sphere-spin--reverse"
                      aria-hidden
                    >
                      <span className="alliance-sphere-band" />
                      <span className="alliance-sphere-shine" />
                    </div>
                    <AllianceLogoMark entry={ebs} side="ebs" />
                  </div>
                  <span className="alliance-sphere-shadow" aria-hidden />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      <ScrollReveal delay={120} from="up" duration={900}>
        <aside
          className="alliance-partner glass-soft relative mt-11 sm:mt-12 lg:mt-14"
          aria-label={t("accreditationsLabel")}
        >
          <p className="alliance-accred-label">{t("accreditationsLabel")}</p>

          <ul className="alliance-accred-row">
            {ACCREDITATIONS.map((item, index) => (
              <li
                key={item.id}
                className="alliance-accred-item"
                style={{ ["--accred-i" as string]: index }}
              >
                <Image
                  src={item.src}
                  alt={item.name}
                  width={338}
                  height={176}
                  className="alliance-accred-img"
                />
              </li>
            ))}
          </ul>
        </aside>
      </ScrollReveal>

      <ul className="alliance-pillars relative mt-11 sm:mt-12 lg:mt-14">
        {PILLARS.map((pillar, i) => (
          <li key={pillar.key} className="alliance-pillar">
            <ScrollReveal delay={160 + i * 90} from="up" duration={820}>
              <p className="alliance-pillar-num">{pillar.num}</p>
              <h3 className="alliance-pillar-title">
                {t(`${pillar.key}Title`)}
              </h3>
              <p className="alliance-pillar-body">{t(`${pillar.key}Body`)}</p>
            </ScrollReveal>
          </li>
        ))}
      </ul>

      <ScrollReveal delay={200} from="up" duration={900}>
        <EbsSourceLinks variant="home" />
      </ScrollReveal>
    </SectionWrapper>
  );
}
