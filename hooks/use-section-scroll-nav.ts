'use client';

import { useEffect } from 'react';

/**
 * One-section-per-scroll navigation: mouse wheel / ArrowUp+Down / PageUp+Down
 * each move exactly one section, with a lock to prevent overshoot. Wheel
 * events over a [data-rail] element scroll it horizontally instead, until
 * it hits an edge. CSS scroll-snap is the fallback for trackpad/touch.
 */
export function useSectionScrollNav(ids: string[]) {
	useEffect(() => {
		const sections = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => Boolean(el));
		if (!sections.length) return;

		let lock = false;
		const go = (dir: number) => {
			const vh = window.innerHeight;
			const y = window.scrollY;
			let idx = 0;
			sections.forEach((el, i) => {
				if (el.offsetTop <= y + vh * 0.5) idx = i;
			});
			const next = Math.min(sections.length - 1, Math.max(0, idx + dir));
			if (next === idx && Math.abs(sections[idx].offsetTop - y) < 4) return;
			lock = true;
			window.scrollTo({ top: sections[next].offsetTop, behavior: 'smooth' });
			setTimeout(() => {
				lock = false;
			}, 780);
		};

		const onWheel = (e: WheelEvent) => {
			if (e.ctrlKey) return;
			if (Math.abs(e.deltaY) < 4) return;
			const target = e.target as HTMLElement | null;
			const rail = target?.closest<HTMLElement>('[data-rail]');
			if (rail) {
				const max = rail.scrollWidth - rail.clientWidth;
				const atEnd =
					e.deltaY > 0 ? rail.scrollLeft >= max - 2 : rail.scrollLeft <= 2;
				if (!atEnd) {
					e.preventDefault();
					rail.scrollLeft += e.deltaY;
					return;
				}
			}
			e.preventDefault();
			if (lock) return;
			go(e.deltaY > 0 ? 1 : -1);
		};

		const onKey = (e: KeyboardEvent) => {
			const keys: Record<string, number> = {
				ArrowDown: 1,
				PageDown: 1,
				ArrowUp: -1,
				PageUp: -1,
			};
			if (!(e.key in keys) || lock) return;
			e.preventDefault();
			go(keys[e.key]);
		};

		window.addEventListener('wheel', onWheel, { passive: false });
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('keydown', onKey);
		};
	}, [ids]);
}
