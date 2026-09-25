"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/common/language-provider";
import { AnimatedHeading } from "@/components/common/animated-heading";
import { ContactForm } from "@/components/common/contact-form";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { socialLinks } from "@/lib/social-links";

export function Contact() {
  const { t } = useLanguage();

  return (
    <Section id="contact">
      <Reveal index={0} className="mx-auto flex w-full max-w-[860px] flex-1 flex-col justify-center text-center">
        <AnimatedHeading
          text={t.contactHeading}
          className="mb-[18px] font-display text-[clamp(30px,6vw,80px)] uppercase leading-[0.96]"
        />
        <p className="mx-auto mb-[30px] max-w-[46ch] text-base leading-relaxed text-muted text-pretty">
          {t.contactSub}
        </p>
        <div className="mt-[clamp(28px,5vh,60px)] flex flex-wrap items-center justify-center gap-2.5">
          <span className="flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-[9px] pr-[18px] text-[13px] text-bg">
            <Image
              src="/portrait.png"
              alt=""
              width={26}
              height={26}
              className="h-[26px] w-[26px] rounded-full object-cover object-[50%_22%] grayscale"
            />
            Dejan Lukić
          </span>
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full border border-ink/[0.11] bg-card px-[18px] py-[11px] text-[13px] transition-colors hover:bg-card-3"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <ContactForm />
      </Reveal>
    </Section>
  );
}
