'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/common/language-provider';
import { CtaLink } from '@/components/common/cta-link';
import { SocialPillLink } from '@/components/common/social-pill-link';
import { Section } from '@/components/common/section';
import { useDrift } from '@/hooks/use-drift';
import { socialLinks } from '@/lib/social-links';

export function Hero() {
	const { t } = useLanguage();
	const wordmarkRef = useDrift<HTMLDivElement>(14, 8);

	return (
		<Section id='top' variant='hero'>
			<div className='pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-[88%] animate-wipe-up justify-center'>
				<div
					ref={wordmarkRef}
					className='flex gap-[0.14em] whitespace-nowrap font-display text-[clamp(56px,15.5vw,300px)] uppercase leading-[0.82] tracking-[-0.01em] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
				>
					<span className='text-transparent [-webkit-text-stroke:clamp(1px,0.22vw,4px)_var(--accent)]'>
						Dejan
					</span>
					<span>Lukić</span>
				</div>
			</div>

			<div
				className='pointer-events-none absolute inset-x-0 bottom-0 flex animate-float-in items-end justify-center'
				style={{ animationDelay: '0.12s' }}
			>
				<Image
					src='/portrait.png'
					alt='Dejan Lukić'
					width={1254}
					height={1254}
					priority
					className='block h-auto max-h-[62vh] w-auto max-w-[min(38vw,520px)] object-contain object-bottom grayscale contrast-[1.05]'
				/>
			</div>

			<div className='relative z-[3] mx-auto flex w-full max-w-[1320px] items-end justify-between gap-[clamp(16px,4vw,60px)] pb-[clamp(22px,6vh,72px)]'>
				<div
					className='max-w-[30ch] animate-rise-in'
					style={{ animationDelay: '0.32s' }}
				>
					<h1 className='mb-2.5 text-[clamp(19px,2.1vw,27px)] font-semibold tracking-[-0.01em]'>
						{t.heroRole}
					</h1>
					<p className='mb-5 max-w-[26ch] text-[15px] leading-normal text-muted text-pretty'>
						{t.heroLine}
					</p>
					<CtaLink href='#contact'>{t.heroCta}</CtaLink>
				</div>

				<div
					className='flex animate-rise-in flex-col items-end gap-2'
					style={{ animationDelay: '0.46s' }}
				>
					{socialLinks.map((link) => (
						<SocialPillLink
							key={link.label}
							href={link.href}
							label={link.label}
						/>
					))}
				</div>
			</div>
		</Section>
	);
}
