'use client';

import { useLanguage } from '@/components/common/language-provider';
import { AnimatedHeading } from '@/components/common/animated-heading';
import { GhostWord } from '@/components/common/ghost-word';
import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';

export function Experience() {
	const { t } = useLanguage();

	return (
		<Section id='experience'>
			<Reveal index={0} className='mx-auto w-full max-w-[1320px]'>
				<div
					className='relative overflow-hidden rounded-[28px] border border-white/[0.14] px-[clamp(22px,4vw,60px)] py-[clamp(24px,4vh,56px)] text-[#f3f1ea] backdrop-blur-[22px] backdrop-saturate-[1.4]'
					style={{
						background:
							'linear-gradient(155deg, rgba(28,27,24,0.55), rgba(16,15,13,0.55))',
						boxShadow:
							'0 40px 80px -40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
					}}
				>
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-0'
						style={{
							background:
								'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)',
						}}
					/>
					<GhostWord
						text={t.expGhost}
						colorClassName='text-white/[0.045]'
						className='left-[clamp(18px,4vw,52px)] top-[-0.16em] text-[clamp(54px,10.5vw,156px)]'
					/>

					<div className='relative mb-[clamp(16px,2.8vh,40px)] flex flex-wrap items-baseline justify-between gap-3'>
						<AnimatedHeading
							slash
							text={t.expLabel}
							className='font-display text-[clamp(24px,3.4vw,46px)] uppercase'
						/>
						<span className='font-mono text-xs tracking-wide text-white/55'>
							{t.expNote}
						</span>
					</div>

					<div className='relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-[clamp(20px,2.6vw,44px)]'>
						<div
							className='absolute left-[5px] right-[5px] top-[30px] hidden h-px md:block'
							style={{
								background:
									'linear-gradient(90deg, rgba(255,255,255,0.32), rgba(255,255,255,0.08))',
							}}
						/>
						<div
							className='pointer-events-none absolute bottom-3 left-[15px] top-3 w-px md:hidden'
							style={{
								background:
									'linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.08))',
							}}
						/>

						<TimelineStep
							date='2017 — 2020'
							dotClassName='bg-white/35'
							stepLabel={t.stepEdu}
							title={t.eduSchool}
							description={t.eduDesc}
						/>
						<TimelineStep
							date='2020 — 2023'
							dotClassName='bg-white/60'
							stepLabel={t.stepFree}
							title={t.freelance}
							description={t.expFree}
						/>
						<TimelineStep
							date={`2023 — ${t.now}`}
							dateClassName='text-accent'
							dotClassName='bg-accent'
							dotSize={13}
							dotGlow
							stepLabel={t.stepJob}
							title='Konis Software d.o.o'
							description={t.expKonis}
							last
						/>
					</div>
				</div>
			</Reveal>
		</Section>
	);
}

function TimelineStep({
	date,
	dateClassName = 'text-white/55',
	dotClassName,
	dotSize = 11,
	dotGlow = false,
	stepLabel,
	title,
	description,
	last = false,
}: {
	date: string;
	dateClassName?: string;
	dotClassName: string;
	dotSize?: number;
	dotGlow?: boolean;
	stepLabel: string;
	title: string;
	description: string;
	last?: boolean;
}) {
	const dot = (
		<span
			className={`relative z-10 rounded-full ${dotClassName}`}
			style={{
				width: dotSize,
				height: dotSize,
				boxShadow: dotGlow
					? '0 0 0 5px #1c1b18, 0 0 0 7px rgb(var(--accent-rgb) / 0.3)'
					: '0 0 0 5px #1c1b18',
			}}
		/>
	);

	return (
		<div
			className={`relative flex gap-4 md:block ${
				last
					? ''
					: 'md:border-r md:border-white/[0.09] md:pr-[clamp(10px,1.6vw,28px)]'
			}`}
		>
			<div className='flex w-8 flex-shrink-0 items-start justify-center pt-1 md:hidden'>
				{dot}
			</div>
			<div className='min-w-0 flex-1 md:flex-none'>
				<div className={`h-5 font-mono text-xs tracking-wide ${dateClassName}`}>
					{date}
				</div>
				<div className='hidden h-5 items-center md:flex'>{dot}</div>
				<div className='mt-1.5 font-mono text-[10px] uppercase tracking-wide text-white/40 md:mt-3.5'>
					{stepLabel}
				</div>
				<div className='mt-1.5 text-[15px] font-semibold leading-[1.28]'>
					{title}
				</div>
				<p className='mt-2 max-w-[32ch] text-[13px] leading-relaxed text-white/60'>
					{description}
				</p>
			</div>
		</div>
	);
}
