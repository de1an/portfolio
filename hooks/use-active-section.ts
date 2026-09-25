'use client';

import { useEffect, useState } from 'react';

/** Tracks which of the given section ids is currently most in view. */
export function useActiveSection(ids: string[]) {
	const [active, setActive] = useState(ids[0]);

	useEffect(() => {
		const sections = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => Boolean(el));
		if (!sections.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				let best: IntersectionObserverEntry | null = null;
				entries.forEach((entry) => {
					if (
						entry.isIntersecting &&
						(!best || entry.intersectionRatio > best.intersectionRatio)
					) {
						best = entry;
					}
				});
				if (best) setActive((best as IntersectionObserverEntry).target.id);
			},
			{ threshold: [0.35, 0.6] },
		);

		sections.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [ids]);

	return active;
}
