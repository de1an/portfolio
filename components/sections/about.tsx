"use client";

import { useLanguage } from "@/components/common/language-provider";
import { AnimatedHeading } from "@/components/common/animated-heading";
import { Pill } from "@/components/common/pill";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { EXPERIENCE_START_YEAR, yearsWord } from "@/lib/i18n";

const TECH_STACK = [
  "Laravel",
  "PHP",
  "Livewire",
  "WordPress",
  "React",
  "Next.js",
  "Nest.js",
  "Node",
  "TypeScript",
  "Python",
  "Tailwind",
  "PostgreSQL",
  "MSSQL",
  "MySQL",
  "Docker",
  "AWS",
];

export function About() {
  const { t, lang } = useLanguage();
  const years = new Date().getFullYear() - EXPERIENCE_START_YEAR;

  return (
    <Section id="about">
      <div className="mx-auto grid w-full max-w-[1320px] items-start gap-[clamp(24px,4vw,68px)] [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]">
        <div>
          <Reveal index={0}>
            <AnimatedHeading
              slash
              text={t.aboutLabel}
              className="mb-[18px] font-display text-[clamp(28px,4.2vw,56px)] uppercase"
            />
          </Reveal>
          <Reveal index={1}>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-wide text-faint">
              {t.stackLabel}
            </div>
          </Reveal>
          <Reveal index={2}>
            <div className="flex flex-wrap gap-[7px]">
              {TECH_STACK.map((tech) => (
                <Pill key={tech} mono>
                  {tech}
                </Pill>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal index={3}>
          <div>
            <p className="mb-4 text-[clamp(16px,1.6vw,21px)] leading-[1.45] tracking-[-0.01em] text-pretty">
              <span className="float-left mr-3 font-display text-[3.4em] leading-[0.82]">
                {years}
              </span>
              {yearsWord(lang, years)} {t.aboutP1Rest}
            </p>
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-muted text-pretty">
              {t.aboutP2}
            </p>
            <div className="mt-[clamp(20px,3vh,32px)] rounded-2xl bg-card-2 px-[22px] py-5">
              <div className="font-mono text-[11px] uppercase tracking-wide text-faint">
                {t.sinceLabel}
              </div>
              <div className="mt-1.5 font-display text-[clamp(26px,3.2vw,40px)] leading-[1.05]">
                {t.sinceValue}
              </div>
              <div className="mt-1.5 max-w-[40ch] text-sm leading-[1.55] text-muted-2">
                {t.sinceNote}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
