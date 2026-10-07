/**
 * A CSS-only laptop mockup: `children` fill the screen (16:10), so a desktop
 * screenshot reads as a device instead of a flat image pasted on a card.
 * Children are expected to fill the screen themselves (e.g. `next/image` with `fill`).
 */
export function LaptopFrame({ children }: { children: React.ReactNode }) {
	return (
		<div className='mx-auto w-full max-w-[860px]'>
			{/* Lid: bezel + screen. Narrower than the base, like a real laptop. */}
			<div className='relative mx-auto w-[88%] rounded-t-[clamp(10px,1.6vw,18px)] border border-b-0 border-ink/[0.12] bg-[#0b0c08] p-[2.2%] pb-[3%] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]'>
				<span
					aria-hidden='true'
					className='absolute left-1/2 top-[0.9%] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-ink/20'
				/>
				<div className='relative aspect-[16/10] overflow-hidden rounded-[3px] bg-card-2'>
					{children}
				</div>
			</div>
			{/* Base: wider deck with the thumb notch in the middle. */}
			<div
				aria-hidden='true'
				className='relative h-[clamp(10px,1.6vw,16px)] rounded-b-[clamp(8px,1.4vw,14px)] rounded-t-[2px] bg-gradient-to-b from-[#3a3c2c] to-[#17180f] shadow-[0_18px_30px_-12px_rgb(0_0_0/0.7)]'
			>
				<span className='absolute left-1/2 top-0 h-[40%] w-[16%] -translate-x-1/2 rounded-b-[6px] bg-[#1d1e14]' />
			</div>
		</div>
	);
}
