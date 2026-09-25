'use client';

import { useDrift } from '@/hooks/use-drift';

/**
 * Fixed full-page decorative layer below all content: a drifting dot-grid,
 * an SVG "network" of nodes that trace themselves in and pulse on a loop,
 * and a sliding hairline rule. Evokes connection/collaboration at low
 * opacity so it never competes with foreground text.
 */
export function AmbientBackground() {
	const gridRef = useDrift<HTMLDivElement>(-9, -5.4);
	const svgRef = useDrift<SVGSVGElement>(-18, -10.8);
	const ruleRef = useDrift<HTMLDivElement>(-27, -16.2);

	return (
		<div
			aria-hidden='true'
			className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
		>
			<div
				ref={gridRef}
				className='absolute -inset-20 animate-grid-drift'
				style={{
					backgroundImage:
						'radial-gradient(rgb(var(--ink-rgb) / 0.16) 1.4px, transparent 1.6px)',
					backgroundSize: '68px 68px',
				}}
			/>
			<svg
				ref={svgRef}
				viewBox='0 0 1200 800'
				preserveAspectRatio='xMidYMid slice'
				className='absolute -inset-[6%] h-[112%] w-[112%]'
			>
				<g fill='none' stroke='rgb(var(--ink-rgb) / 0.16)' strokeWidth={1}>
					<path
						d='M120 150 L360 300 L300 560 L120 150'
						className='animate-trace-line [animation-duration:9s] [animation-delay:0.2s]'
						style={{ strokeDasharray: 1500, strokeDashoffset: 1500 }}
					/>
					<path
						d='M360 300 L640 210 L900 340 L640 520 L360 300'
						className='animate-trace-line [animation-duration:13s] [animation-delay:1.4s]'
						style={{ strokeDasharray: 1500, strokeDashoffset: 1500 }}
					/>
					<path
						d='M900 340 L1080 600 L740 700'
						className='animate-trace-line [animation-duration:11s] [animation-delay:2.8s]'
						style={{ strokeDasharray: 1500, strokeDashoffset: 1500 }}
					/>
					<path
						d='M300 560 L640 520 L740 700'
						className='animate-trace-line [animation-duration:15s] [animation-delay:4.1s]'
						style={{ strokeDasharray: 1500, strokeDashoffset: 1500 }}
					/>
					<path
						d='M640 210 L520 40'
						className='animate-trace-line [animation-duration:8s] [animation-delay:1s]'
						style={{ strokeDasharray: 1500, strokeDashoffset: 1500 }}
					/>
				</g>
				<g fill='rgb(var(--ink-rgb) / 0.3)'>
					<circle
						cx={120}
						cy={150}
						r={4}
						className='animate-node-pulse [animation-delay:0s]'
					/>
					<circle
						cx={360}
						cy={300}
						r={5}
						className='animate-node-pulse [animation-delay:0.9s]'
					/>
					<circle
						cx={640}
						cy={210}
						r={4}
						className='animate-node-pulse [animation-delay:1.7s]'
					/>
					<circle
						cx={900}
						cy={340}
						r={5}
						className='animate-node-pulse [animation-delay:2.4s]'
					/>
					<circle
						cx={300}
						cy={560}
						r={4}
						className='animate-node-pulse [animation-delay:3.1s]'
					/>
					<circle
						cx={640}
						cy={520}
						r={5}
						className='animate-node-pulse [animation-delay:3.9s]'
					/>
					<circle
						cx={1080}
						cy={600}
						r={4}
						className='animate-node-pulse [animation-delay:4.6s]'
					/>
					<circle
						cx={740}
						cy={700}
						r={4}
						className='animate-node-pulse [animation-delay:5.3s]'
					/>
					<circle
						cx={520}
						cy={40}
						r={3}
						className='animate-node-pulse [animation-delay:6s]'
					/>
				</g>
			</svg>
			<div
				ref={ruleRef}
				className='absolute left-0 top-[26%] h-px w-[34%] animate-rule-slide'
				style={{
					background:
						'linear-gradient(90deg, transparent, rgb(var(--ink-rgb) / 0.2), transparent)',
				}}
			/>
		</div>
	);
}
