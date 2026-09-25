type SectionProps = {
	id: string;
	children: React.ReactNode;
	/** Hero doesn't get the divider line above it or bottom padding — content sits flush at the viewport edge. */
	variant?: 'default' | 'hero';
	className?: string;
};

/** One full-viewport (100vh), snap-aligned section shared by every section on the page. */
export function Section({
	id,
	children,
	variant = 'default',
	className,
}: SectionProps) {
	const isHero = variant === 'hero';
	return (
		<section
			id={id}
			data-snap
			className={`relative flex min-h-screen flex-col overflow-hidden px-[clamp(18px,4vw,56px)] [scroll-snap-align:start] ${
				isHero
					? 'justify-end pt-[clamp(70px,9vh,100px)]'
					: `z-[1] justify-center pt-[clamp(80px,10vh,110px)] pb-[clamp(40px,6vh,70px)] ${
							id !== 'experience' ? 'border-t border-ink/[0.09]' : ''
						}`
			} ${className ?? ''}`}
		>
			{children}
		</section>
	);
}
