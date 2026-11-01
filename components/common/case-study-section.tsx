type CaseStudySectionProps = {
	children: React.ReactNode;
	/** Suppresses the top hairline — used by the first section under the hero block. */
	noBorder?: boolean;
	className?: string;
};

/**
 * A normal, vertically-scrolling section for the case study page. Unlike
 * components/common/section.tsx it has no min-h-screen and no scroll-snap —
 * this page scrolls like an ordinary long page, not the home page's
 * one-section-per-gesture rail.
 *
 * Clips horizontally so oversized decoration (the hero GhostWord) can't widen
 * the page — on phones that makes the browser zoom the whole layout out, and
 * fixed overlays like the gallery lightbox end up wider than the screen.
 */
export function CaseStudySection({
	children,
	noBorder,
	className,
}: CaseStudySectionProps) {
	return (
		<section
			className={`relative overflow-x-clip px-[clamp(18px,4vw,56px)] py-[clamp(40px,7vh,80px)] ${
				noBorder ? '' : 'border-t border-ink/[0.09]'
			} ${className ?? ''}`}
		>
			<div className='mx-auto w-full max-w-[1320px]'>{children}</div>
		</section>
	);
}
