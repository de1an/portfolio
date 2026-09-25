"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/common/language-provider";
import { useActiveSection } from "@/hooks/use-active-section";
import { SECTIONS } from "@/lib/i18n";

const IDS = SECTIONS.map((s) => s.id);

/** Fixed left-gutter dot rail: one dot per section, active dot stretches; its label stays visible, others reveal on hover. */
export function SectionDotRail() {
  const { t } = useLanguage();
  const active = useActiveSection(IDS);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="fixed left-[clamp(10px,1.6vw,26px)] top-1/2 z-[45] hidden -translate-y-1/2 flex-col gap-1 sm:flex">
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        const isHovered = hovered === section.id;
        const showLabel = isActive || isHovered;
        return (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className="flex items-center gap-2.5 px-1.5 py-1.5"
            onMouseEnter={() => setHovered(section.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="h-[9px] flex-none rounded-full transition-[width,background] duration-300"
              style={{
                width: isActive ? 26 : 9,
                background:
                  isActive || isHovered
                    ? "var(--ink)"
                    : "rgb(var(--ink-rgb) / 0.26)",
              }}
            />
            <span
              className="pointer-events-none whitespace-nowrap rounded-full bg-bg/90 font-mono text-[11px] uppercase tracking-wide text-ink transition-[opacity,transform,padding] duration-300"
              style={{
                padding: showLabel ? "5px 10px" : "5px 0",
                opacity: showLabel ? 1 : 0,
                transform: showLabel ? "translateX(0)" : "translateX(-8px)",
              }}
            >
              {t[section.key]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
