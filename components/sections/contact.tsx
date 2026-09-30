'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/common/language-provider';
import { AnimatedHeading } from '@/components/common/animated-heading';
import { ContactForm } from '@/components/common/contact-form';
import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import Footer from '@/components/Footer';
import { socialLinks } from '@/lib/social-links';

export function Contact() {
	const { t } = useLanguage();

	return (
		<Section id='contact' className='!pb-0'>
			<Reveal
				index={0}
				className='mx-auto flex w-full max-w-[1100px] flex-1 flex-col justify-center text-center'
			>
				<AnimatedHeading
					text={t.contactHeading}
					className='mb-3 font-display text-[clamp(30px,min(5vw,8vh),72px)] leading-[1.1] text-balance'
				/>
				<p className='mx-auto mb-4 max-w-[46ch] text-base leading-relaxed text-muted text-pretty'>
					{t.contactSub}
				</p>
				<div className='flex flex-wrap items-center justify-center gap-2.5'>
					<span className='flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-[9px] pr-[18px] text-[13px] text-bg'>
						<Image
							src='/portrait.png'
							alt=''
							width={26}
							height={26}
							className='h-[26px] w-[26px] rounded-full object-cover object-[50%_22%] grayscale'
						/>
						Dejan Lukić
					</span>
					{socialLinks
						.filter((link) => !link.href.startsWith('mailto:'))
						.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								target='_blank'
								rel='noopener noreferrer'
								className='rounded-full border border-ink/[0.11] bg-card px-[18px] py-[11px] text-[13px] transition-colors hover:bg-card-3'
							>
								{link.label}
							</Link>
						))}
				</div>

				<ContactForm />
			</Reveal>
			<Footer embedded />
		</Section>
	);
}
