'use client';

import { useEffect, useRef } from 'react';

/** Oversized faint decorative word behind a section heading; drifts on scroll. */
export function GhostWord({
	text,
	className,
	colorClassName = 'text-ink/5',
}: {
	text: string;
	className?: string;
	/** Override the default palette-driven tint, e.g. for a fixed-dark panel. */
	colorClassName?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const el = ref.current;
		if (!el) return;

		const onScroll = () => {
			const vh = window.innerHeight;
			const rect = el.getBoundingClientRect();
			const p = (rect.top + rect.height / 2 - vh / 2) / vh;
			el.style.transform = `translate3d(${(p * -46).toFixed(1)}px, ${(p * 18).toFixed(1)}px, 0)`;
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	return (
		<span
			ref={ref}
			aria-hidden='true'
			className={`pointer-events-none absolute whitespace-nowrap font-display uppercase leading-none ${colorClassName} ${className ?? ''}`}
		>
			{text}
		</span>
	);
}
