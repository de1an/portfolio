'use client';

import { useEffect, useRef, useState } from 'react';

type AnimatedHeadingProps = {
	text: string;
	className?: string;
	/** Renders a leading accent-colored "/" before the words, like /Service. */
	slash?: boolean;
};

/**
 * Section heading that reveals word-by-word (each word clipped and slid up)
 * the first time it scrolls into view.
 */
export function AnimatedHeading({
	text,
	className,
	slash,
}: AnimatedHeadingProps) {
	const ref = useRef<HTMLHeadingElement>(null);
	const [revealed, setRevealed] = useState(false);
	const words = text.split(/\s+/).filter(Boolean);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setRevealed(true);
			return;
		}
		const el = ref.current;
		if (!el) return;

		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setRevealed(true);
						io.unobserve(el);
					}
				});
			},
			{ threshold: 0.2 },
		);
		io.observe(el);

		const safety = setTimeout(() => setRevealed(true), 4000);
		return () => {
			io.disconnect();
			clearTimeout(safety);
		};
	}, []);

	return (
		<h2 ref={ref} className={className}>
			{slash && <span className='text-accent'>/</span>}
			{words.map((word, i) => (
				<span key={`${word}-${i}`}>
					<span className='inline-block overflow-hidden align-bottom'>
						<span
							className='inline-block transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
							style={{
								transform: revealed ? 'translateY(0)' : 'translateY(105%)',
								transitionDelay: `${i * 70}ms`,
							}}
						>
							{word}
						</span>
					</span>
					<span className='inline-block whitespace-pre'> </span>
				</span>
			))}
		</h2>
	);
}
