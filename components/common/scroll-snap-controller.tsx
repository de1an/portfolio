'use client';

import { useSectionScrollNav } from '@/hooks/use-section-scroll-nav';
import { SECTIONS } from '@/lib/i18n';

const IDS = SECTIONS.map((s) => s.id);

/** Wires up wheel/keyboard one-section-at-a-time scrolling. Renders nothing. */
export function ScrollSnapController() {
	useSectionScrollNav(IDS);
	return null;
}
