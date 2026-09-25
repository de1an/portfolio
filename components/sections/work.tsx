'use client';

import { useLanguage } from '@/components/common/language-provider';
import { AnimatedHeading } from '@/components/common/animated-heading';
import { GhostWord } from '@/components/common/ghost-word';
import { Reveal } from '@/components/common/reveal';
import { Section } from '@/components/common/section';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import type { Project } from '@/lib/project-schema';
import { ProjectCard } from '@/components/sections/project-card';

export function Work({ projects }: { projects: Project[] }) {
	const { t } = useLanguage();
	const railRef = useDragScroll<HTMLDivElement>();

	const nudgeRail = (dir: number) => {
		const rail = railRef.current;
		if (!rail) return;
		const step = dir * Math.max(260, rail.clientWidth * 0.7);
		const from = rail.scrollLeft;
		rail.scrollBy({ left: step, behavior: 'smooth' });
		setTimeout(() => {
			if (Math.abs(rail.scrollLeft - from) < 8) rail.scrollLeft = from + step;
		}, 320);
	};

	return (
		<Section id='work'>
			<div className='mx-auto w-full max-w-[1320px]'>
				<div className='flex flex-wrap items-end justify-between gap-4'>
					<div className='relative'>
						<GhostWord
							text='Portfolio'
							className='-left-[0.03em] top-[-0.44em] text-[clamp(58px,10.5vw,160px)]'
						/>
						<Reveal index={0}>
							<AnimatedHeading
								slash
								text={t.workLabel}
								className='relative font-display text-[clamp(28px,4.2vw,56px)] uppercase'
							/>
						</Reveal>
					</div>
					<div className='relative flex items-center gap-3'>
						<button
							type='button'
							onClick={() => nudgeRail(-1)}
							className='group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/[0.16] bg-card transition-colors hover:bg-ink'
							aria-label='Previous'
						>
							<svg
								width='18'
								height='18'
								viewBox='0 0 24 24'
								fill='none'
								className='block shrink-0 stroke-ink transition-colors group-hover:stroke-bg'
							>
								<path
									d='M15 5 8 12l7 7'
									strokeWidth='1.75'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</button>
						<button
							type='button'
							onClick={() => nudgeRail(1)}
							className='group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/[0.16] bg-card transition-colors hover:bg-ink'
							aria-label='Next'
						>
							<svg
								width='18'
								height='18'
								viewBox='0 0 24 24'
								fill='none'
								className='block shrink-0 stroke-ink transition-colors group-hover:stroke-bg'
							>
								<path
									d='M9 5l7 7-7 7'
									strokeWidth='1.75'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</button>
					</div>
				</div>

				<div
					ref={railRef}
					data-rail
					className='mt-[clamp(20px,3.4vh,40px)] flex items-start gap-[clamp(14px,1.6vw,24px)] overflow-x-auto px-0.5 pb-2.5 pt-1 [scroll-snap-type:x_mandatory] [scrollbar-width:none]'
				>
					{projects.map((project) => (
						<ProjectCard key={project.slug} project={project} />
					))}
				</div>
			</div>
		</Section>
	);
}
