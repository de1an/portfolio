'use client';

import { useLanguage } from '@/components/common/language-provider';
import { AnimatedHeading } from '@/components/common/animated-heading';
import { GhostWord } from '@/components/common/ghost-word';
import { CtaLink } from '@/components/common/cta-link';
import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { ServiceBuild } from '@/components/sections/service-build';

export function Service() {
	const { t } = useLanguage();

	return (
		<Section id='service'>
			<div className='mx-auto grid w-full max-w-[1320px] items-center gap-[clamp(32px,6vw,64px)] lg:grid-cols-2'>
				<div className='relative'>
					<GhostWord
						text={t.serviceGhost}
						className='-left-[0.03em] top-[-0.5em] text-[clamp(56px,9.5vw,150px)]'
					/>
					<Reveal index={0}>
						<AnimatedHeading
							slash
							text={t.serviceHeadline}
							className='relative font-display text-[clamp(28px,3.9vw,52px)] uppercase leading-[1.04]'
						/>
					</Reveal>
					<Reveal index={1}>
						<p className='relative mt-5 max-w-[48ch] text-[15px] leading-relaxed text-muted text-pretty'>
							{t.serviceIntro}
						</p>
					</Reveal>
					<Reveal index={2}>
						<div className='relative mt-[clamp(28px,5vh,48px)]'>
							<p className='mb-4 max-w-[32ch] text-[15px] leading-snug text-muted-2 text-pretty'>
								{t.serviceCtaLead}
							</p>
							<CtaLink href='#contact'>{t.serviceCta}</CtaLink>
						</div>
					</Reveal>
				</div>

				<Reveal index={1} className='relative'>
					<ServiceBuild />
				</Reveal>
			</div>
		</Section>
	);
}
