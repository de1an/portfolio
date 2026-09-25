'use client';

import {
	Fragment,
	useEffect,
	useRef,
	useState,
	type CSSProperties,
} from 'react';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';
const CHART_BARS = [38, 66, 48, 82];

const CODE_LINES: React.ReactNode[] = [
	<Fragment key='fn'>
		<span className='text-accent'>function</span>{' '}
		<span className='text-ink/70'>buildApp</span>
		<span className='text-faint'>() {'{'}</span>
	</Fragment>,
	<Fragment key='ui'>
		<span className='text-faint'> </span>
		<span className='text-accent'>const</span>{' '}
		<span className='text-ink/70'>ui</span>{' '}
		<span className='text-faint'>=</span>{' '}
		<span className='text-ink/70'>render</span>
		<span className='text-faint'>(</span>
		<span className='text-muted-2'>{'<App />'}</span>
		<span className='text-faint'>)</span>
	</Fragment>,
	<Fragment key='api'>
		<span className='text-faint'> </span>
		<span className='text-accent'>const</span>{' '}
		<span className='text-ink/70'>api</span>{' '}
		<span className='text-faint'>=</span>{' '}
		<span className='text-ink/70'>connect</span>
		<span className='text-faint'>(</span>
		<span className='text-muted-2'>&apos;/api&apos;</span>
		<span className='text-faint'>)</span>
	</Fragment>,
	<Fragment key='sync'>
		<span className='text-faint'> </span>
		<span className='text-ink/70'>api</span>
		<span className='text-faint'>.</span>
		<span className='text-ink/70'>sync</span>
		<span className='text-faint'>(db)</span>
	</Fragment>,
	<Fragment key='mount'>
		<span className='text-faint'> </span>
		<span className='text-accent'>return</span>{' '}
		<span className='text-ink/70'>ui</span>
		<span className='text-faint'>.</span>
		<span className='text-ink/70'>mount</span>
		<span className='text-faint'>(</span>
		<span className='text-muted-2'>&apos;#root&apos;</span>
		<span className='text-faint'>)</span>
	</Fragment>,
	<span key='close' className='text-faint'>
		{'}'}
	</span>,
];

/**
 * Decorative pseudo-3D illustration: a browser window assembles itself —
 * frame, then interface, then dashboard elements, then the API/DB "system"
 * nodes beside it — then, once assembled, slowly flips on its Y axis
 * like a card to reveal the code behind it on its reverse face, holds, and
 * flips back. Plays whenever it scrolls into view (and replays on re-entry,
 * since the page snap-scrolls one section at a time rather than scrubbing a
 * pinned timeline). Reduced motion shows the finished, front-facing state
 * only — it never flips.
 */
export function ServiceBuild() {
	const ref = useRef<HTMLDivElement>(null);
	const [reduced, setReduced] = useState(false);
	const [play, setPlay] = useState(false);

	useEffect(() => {
		setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
	}, []);

	useEffect(() => {
		if (reduced) {
			setPlay(true);
			return;
		}
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => entries.forEach((entry) => setPlay(entry.isIntersecting)),
			{ threshold: 0.45 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [reduced]);

	/** Fade/slide an element in from `hidden`, staggered by `delay`ms; reduced-motion skips straight to the resting state. */
	const step = (
		hidden: string,
		delay: number,
		duration = 850,
	): CSSProperties => {
		if (reduced) return { opacity: 1, transform: 'none' };
		return {
			opacity: play ? 1 : 0,
			transform: play ? 'none' : hidden,
			transitionProperty: 'opacity, transform',
			transitionDuration: `${duration}ms`,
			transitionTimingFunction: EASE,
			transitionDelay: play ? `${delay}ms` : '0ms',
		};
	};

	const faceClass =
		'absolute inset-0 overflow-hidden rounded-[22px] border border-ink/15 shadow-[0_40px_80px_-40px_rgb(var(--ink-rgb)/0.55)] [backface-visibility:hidden]';

	return (
		<div
			ref={ref}
			aria-hidden='true'
			className='relative mx-auto w-full max-w-[420px] select-none sm:max-w-[460px] lg:max-w-[540px] [perspective:1600px]'
		>
			<div
				className='absolute inset-[8%] rounded-[32px] bg-accent/10 blur-[48px] transition-opacity duration-[1400ms]'
				style={{
					transitionTimingFunction: EASE,
					opacity: play || reduced ? 1 : 0,
				}}
			/>

			<div
				className='relative aspect-[6/5] [transform-style:preserve-3d]'
				style={{ transform: 'rotateX(7deg) rotateY(-11deg)' }}
			>
				<svg
					viewBox='0 0 100 84'
					preserveAspectRatio='xMidYMid meet'
					className='pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible sm:block'
				>
					<g style={step('translate(-6px,-4px) scale(0.7)', 900, 700)}>
						<circle
							cx='3'
							cy='22'
							r='3.4'
							fill='var(--card)'
							stroke='var(--accent)'
							strokeWidth='0.8'
							className='origin-center animate-node-pulse'
						/>
					</g>
					<g style={step('translate(6px,4px) scale(0.7)', 1050, 700)}>
						<rect
							x='90.5'
							y='53'
							width='8.5'
							height='10.5'
							rx='1.5'
							fill='var(--card)'
							stroke='var(--accent)'
							strokeWidth='0.8'
							className='origin-center animate-node-pulse'
							style={{ animationDelay: '0.9s' }}
						/>
						<line
							x1='91'
							y1='56.2'
							x2='98.2'
							y2='56.2'
							stroke='var(--accent)'
							strokeWidth='0.5'
							opacity='0.6'
						/>
						<line
							x1='91'
							y1='59.3'
							x2='98.2'
							y2='59.3'
							stroke='var(--accent)'
							strokeWidth='0.5'
							opacity='0.6'
						/>
					</g>
				</svg>

				{/* Entrance: the card assembles/scales in as a whole before it starts flipping. */}
				<div
					className='absolute inset-0 [transform-style:preserve-3d]'
					style={step('translateY(22px) scale(0.94)', 0, 700)}
				>
					{/* Flip: once assembled, turns on its Y axis to show the code face, holds, and turns back. */}
					<div
						className={`absolute inset-0 [transform-style:preserve-3d] ${
							play && !reduced ? 'animate-card-flip' : ''
						}`}
					>
						{/* Front face — the app. translateZ separates it from the back face so they don't z-fight (visible as flickering seam lines) while edge-on mid-flip. */}
						<div
							className={`${faceClass} bg-card`}
							style={{ transform: 'translateZ(1px)' }}
						>
							<div className='flex items-center gap-[5px] border-b border-ink/10 px-[6%] py-[4.5%]'>
								<span className='h-[7px] w-[7px] flex-none rounded-full bg-ink/15' />
								<span className='h-[7px] w-[7px] flex-none rounded-full bg-ink/15' />
								<span className='h-[7px] w-[7px] flex-none rounded-full bg-ink/15' />
								<span
									className='ml-2 h-[7px] w-full max-w-[120px] flex-1 rounded-full bg-card-2'
									style={step('translateX(-10px)', 200, 600)}
								/>
								<span
									className='ml-auto h-[8px] w-[8px] flex-none animate-node-pulse rounded-full bg-accent'
									style={step('scale(0)', 1450, 500)}
								/>
							</div>

							<div
								className='flex items-center gap-[6%] px-[6%] pt-[6%]'
								style={step('translateY(-10px)', 300, 650)}
							>
								<span className='h-[6px] w-[22%] rounded-full bg-ink/25' />
								<span className='h-[6px] w-[12%] rounded-full bg-ink/15' />
								<span className='h-[6px] w-[12%] rounded-full bg-ink/15' />
								<span className='ml-auto h-[15px] w-[16%] rounded-full bg-accent/80' />
							</div>

							<div className='grid grid-cols-2 gap-[6%] px-[6%] pt-[9%]'>
								<div
									className='flex flex-col gap-[12%]'
									style={step('translateX(-18px)', 420, 700)}
								>
									<span className='block h-[10px] w-[82%] rounded-[3px] bg-ink/70' />
									<span className='block h-[7px] w-[58%] rounded-[3px] bg-ink/25' />
									<span className='mt-[6%] block h-[18px] w-[48%] rounded-full bg-accent' />
								</div>

								<div className='flex h-[64px] items-end justify-center gap-[8%]'>
									{CHART_BARS.map((h, i) => (
										<span
											key={h}
											className='w-[18%] origin-bottom rounded-t-[3px] bg-accent/70'
											style={{
												height: `${h}%`,
												...step('scaleY(0.15)', 560 + i * 90, 600),
											}}
										/>
									))}
								</div>
							</div>

							<div className='mt-[8%] flex flex-col gap-[10px] px-[6%] pb-[7%]'>
								{[0, 1, 2].map((row) => (
									<div
										key={row}
										className='flex items-center gap-[4%]'
										style={step('translateY(14px)', 760 + row * 90, 650)}
									>
										<span className='h-[6px] w-[6px] flex-none rounded-full bg-card-3' />
										<span className='h-[5px] flex-1 rounded-full bg-card-2' />
										<span className='h-[5px] w-[16%] flex-none rounded-full bg-card-3' />
									</div>
								))}
							</div>
						</div>

						{/* Back face — the code, same size as the front. */}
						<div
							className={`${faceClass} flex flex-col bg-card-2`}
							style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
						>
							<div className='flex items-center gap-[5px] border-b border-ink/10 px-[6%] py-[4.5%]'>
								<span className='h-[7px] w-[7px] flex-none rounded-full bg-ink/15' />
								<span className='h-[7px] w-[7px] flex-none rounded-full bg-ink/15' />
								<span className='h-[7px] w-[7px] flex-none rounded-full bg-ink/15' />
								<span className='ml-auto font-mono text-[8.5px] uppercase tracking-wide text-faint sm:text-[9.5px]'>
									app.tsx
								</span>
							</div>
							<div className='flex flex-1 flex-col justify-center gap-[7%] px-[8%] py-[6%] font-mono text-[10.5px] leading-[1.9] sm:text-[12px]'>
								{CODE_LINES.map((line, i) => (
									<div key={i} className='whitespace-pre'>
										{line}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
