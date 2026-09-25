"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/common/language-provider";
import { AnimatedHeading } from "@/components/common/animated-heading";
import { GhostWord } from "@/components/common/ghost-word";
import { Reveal } from "@/components/common/reveal";
import { Pill } from "@/components/common/pill";
import { CtaLink } from "@/components/common/cta-link";
import { CaseStudySection } from "@/components/common/case-study-section";
import { pick, type Project, type ProjectStatus } from "@/lib/project-schema";
import type { StringKey } from "@/lib/i18n";

const STATUS_KEY: Record<ProjectStatus, StringKey> = {
  live: "statusLive",
  internal: "statusInternal",
  archived: "statusArchived",
};

const HEADING = "font-display text-[clamp(26px,3.6vw,44px)] uppercase";

export function CaseStudyView({ project, next }: { project: Project; next: Project | null }) {
  const { t, lang } = useLanguage();
  const cs = project.caseStudy; // undefined until this project's case study is filled in via /admin

  const facts: { label: string; value: string }[] = cs
    ? [
        { label: t.csYear, value: cs.year },
        { label: t.csRole, value: pick(cs.role, lang) },
        ...(cs.client ? [{ label: t.csClient, value: cs.client }] : []),
        ...(cs.scope ? [{ label: t.csScope, value: pick(cs.scope, lang) }] : []),
        ...(cs.status ? [{ label: t.csStatus, value: t[STATUS_KEY[cs.status]] }] : []),
      ]
    : [];

  return (
    <>
      <div className="px-[clamp(18px,4vw,56px)] pt-[clamp(90px,11vh,130px)]">
        <div className="mx-auto w-full max-w-[1320px]">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-faint transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span> {t.csBack}
          </Link>
        </div>
      </div>

      <CaseStudySection noBorder>
        <div className="relative">
          <GhostWord
            text={project.title}
            className="-left-[0.03em] top-[-0.5em] text-[clamp(48px,9vw,140px)]"
          />
          <Reveal index={0}>
            <div className="relative">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-faint">
                {t[project.typeKey]}
              </div>
              <h1 className="font-display text-[clamp(32px,6vw,76px)] uppercase leading-[1.02]">
                {project.title}
              </h1>
              <p className="mt-4 max-w-[62ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-muted text-pretty">
                {pick(project.summary, lang)}
              </p>
            </div>
          </Reveal>
        </div>

        {cs && (
          <Reveal index={1}>
            <div className="mt-[clamp(28px,4vh,48px)] flex flex-wrap items-center gap-x-[clamp(20px,3vw,48px)] gap-y-4 border-y border-ink/[0.09] py-5">
              {facts.map((f) => (
                <div key={f.label}>
                  <div className="font-mono text-[10px] uppercase tracking-wide text-faint">
                    {f.label}
                  </div>
                  <div className="mt-1 text-[15px]">{f.value}</div>
                </div>
              ))}
              {cs.url && (
                <div className="ml-auto">
                  <CtaLink href={cs.url} size="sm">
                    {t.csVisit}
                  </CtaLink>
                </div>
              )}
            </div>
          </Reveal>
        )}
      </CaseStudySection>

      <CaseStudySection noBorder className="pt-0">
        <Reveal index={0}>
          <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[24px] bg-card-2">
            {project.cover ? (
              <Image
                src={project.cover.src}
                alt={pick(project.cover.alt, lang)}
                width={project.cover.width}
                height={project.cover.height}
                className="h-full w-full object-contain"
                priority
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{
                  background:
                    "repeating-linear-gradient(135deg, var(--card-4) 0 9px, var(--card-2) 9px 18px)",
                }}
              >
                <span className="font-mono text-[11px] uppercase tracking-wide text-faint">
                  {project.title}
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </CaseStudySection>

      {cs && (
        <CaseStudySection>
          <div className="grid gap-[clamp(24px,4vw,68px)] [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]">
            <Reveal index={0}>
              <AnimatedHeading slash text={t.csOverview} className={HEADING} />
            </Reveal>
            <Reveal index={1}>
              <div className="max-w-[62ch] space-y-4">
                {cs.context.map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-muted text-pretty">
                    {pick(paragraph, lang)}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </CaseStudySection>
      )}

      {cs && cs.metrics.length > 0 && (
        <CaseStudySection>
          <Reveal index={0}>
            <AnimatedHeading slash text={t.csResults} className={`mb-8 ${HEADING}`} />
          </Reveal>
          <div className="flex flex-wrap gap-[clamp(24px,4vw,56px)]">
            {cs.metrics.map((m, i) => (
              <Reveal key={i} index={i + 1}>
                <div>
                  <div className="font-display text-[clamp(36px,5vw,64px)] leading-none">
                    {m.value}
                  </div>
                  <div className="mt-2 max-w-[22ch] text-sm text-muted">
                    {pick(m.label, lang)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </CaseStudySection>
      )}

      {cs && cs.challenges.length > 0 && (
        <CaseStudySection>
          <Reveal index={0}>
            <AnimatedHeading slash text={t.csChallenges} className={`mb-8 ${HEADING}`} />
          </Reveal>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {cs.challenges.map((c, i) => (
              <Reveal key={i} index={i + 1}>
                <div className="h-full rounded-2xl bg-card-2 p-[22px]">
                  <div className="font-mono text-[10px] uppercase tracking-wide text-faint">
                    {t.csProblem}
                  </div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-pretty">
                    {pick(c.problem, lang)}
                  </p>
                  <div className="mt-4 font-mono text-[10px] uppercase tracking-wide text-accent-dim">
                    {t.csSolution}
                  </div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted text-pretty">
                    {pick(c.solution, lang)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </CaseStudySection>
      )}

      {cs && cs.delivered.length > 0 && (
        <CaseStudySection>
          <Reveal index={0}>
            <AnimatedHeading slash text={t.csDelivered} className={`mb-8 ${HEADING}`} />
          </Reveal>
          <div className="grid gap-x-8 gap-y-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {cs.delivered.map((d, i) => (
              <Reveal key={i} index={i + 1}>
                <div className="flex gap-4">
                  <div className="font-mono text-[11px] uppercase tracking-wide text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold">{pick(d.title, lang)}</div>
                    {d.detail && (
                      <div className="mt-1 max-w-[46ch] text-sm leading-relaxed text-muted">
                        {pick(d.detail, lang)}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </CaseStudySection>
      )}

      {cs && cs.timeline.length > 0 && (
        <CaseStudySection>
          <Reveal index={0}>
            <AnimatedHeading slash text={t.csTimeline} className={`mb-8 ${HEADING}`} />
          </Reveal>
          <div className="space-y-6 border-l border-ink/[0.12] pl-6">
            {cs.timeline.map((step, i) => (
              <Reveal key={i} index={i + 1}>
                <div className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                  <div className="text-[15px] font-semibold">{pick(step.label, lang)}</div>
                  <div className="mt-1 max-w-[56ch] text-sm leading-relaxed text-muted">
                    {pick(step.detail, lang)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </CaseStudySection>
      )}

      {cs && cs.stack.length > 0 ? (
        <CaseStudySection>
          <Reveal index={0}>
            <AnimatedHeading slash text={t.csStack} className={`mb-8 ${HEADING}`} />
          </Reveal>
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {cs.stack.map((group, i) => (
              <Reveal key={i} index={i + 1}>
                <div>
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-wide text-faint">
                    {pick(group.group, lang)}
                  </div>
                  <div className="flex flex-wrap gap-[7px]">
                    {group.items.map((item) => (
                      <Pill key={item} mono>
                        {item}
                      </Pill>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </CaseStudySection>
      ) : (
        project.tech &&
        project.tech.length > 0 && (
          <CaseStudySection>
            <Reveal index={0}>
              <AnimatedHeading slash text={t.csStack} className={`mb-8 ${HEADING}`} />
            </Reveal>
            <div className="flex flex-wrap gap-[7px]">
              {project.tech.map((item) => (
                <Pill key={item} mono>
                  {item}
                </Pill>
              ))}
            </div>
          </CaseStudySection>
        )
      )}

      {cs && cs.gallery.length > 0 && (
        <CaseStudySection>
          <Reveal index={0}>
            <AnimatedHeading slash text={t.csGallery} className={`mb-8 ${HEADING}`} />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {cs.gallery.map((img, i) => (
              <Reveal key={i} index={i + 1} className={i === 0 ? "sm:col-span-2" : ""}>
                <figure>
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={img.src}
                      alt={pick(img.alt, lang)}
                      width={img.width}
                      height={img.height}
                      className="w-full object-cover"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="mt-2 text-sm text-muted">
                      {pick(img.caption, lang)}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        </CaseStudySection>
      )}

      {cs?.note && (
        <CaseStudySection noBorder>
          <p className="rounded-2xl bg-card-2 px-[22px] py-4 text-sm text-muted">
            {pick(cs.note, lang)}
          </p>
        </CaseStudySection>
      )}

      <CaseStudySection>
        <div className="flex flex-wrap items-center justify-between gap-6">
          {next ? (
            <Link href={`/work/${next.slug}`} className="group">
              <div className="font-mono text-[11px] uppercase tracking-wide text-faint">
                {t.csNext}
              </div>
              <div className="mt-1.5 font-display text-[clamp(24px,3.4vw,40px)] uppercase transition-transform group-hover:translate-x-1.5">
                {next.title} <span aria-hidden="true">→</span>
              </div>
            </Link>
          ) : (
            <span />
          )}
          <CtaLink href="/#contact">{t.heroCta}</CtaLink>
        </div>
      </CaseStudySection>
    </>
  );
}
