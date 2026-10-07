'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/components/common/language-provider';
import { pick, type ProjectImage } from '@/lib/project-schema';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

const ICON_BUTTON =
	'flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-card/80 text-ink backdrop-blur transition-colors hover:border-ink/40 disabled:opacity-30 disabled:hover:border-ink/15';

/** Same circular chevron button as the Work slider, vertically centred on the image area. */
function ArrowButton({
	dir,
	label,
	onClick,
	className,
}: {
	dir: 1 | -1;
	label: string;
	onClick: () => void;
	className: string;
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			aria-label={label}
			className={`group absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.16] bg-card transition-colors hover:bg-ink ${className}`}
		>
			<svg
				width='20'
				height='20'
				viewBox='0 0 24 24'
				fill='none'
				aria-hidden='true'
				className='block shrink-0 stroke-ink transition-colors group-hover:stroke-bg'
			>
				<path
					d={dir === -1 ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'}
					strokeWidth='1.75'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</button>
	);
}

/** Small thumbnail grid; clicking a thumbnail opens a zoomable, arrow-navigable lightbox. */
export function CaseStudyGallery({ images }: { images: ProjectImage[] }) {
	const { t, lang } = useLanguage();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<>
			<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
				{images.map((img, i) => (
					<button
						key={img.src}
						type='button'
						onClick={() => setOpenIndex(i)}
						aria-label={`${t.galleryOpen}: ${pick(img.alt, lang)}`}
						className='group relative aspect-[16/10] overflow-hidden rounded-xl border border-ink/10 bg-card-2'
					>
						<Image
							src={img.src}
							alt={pick(img.alt, lang)}
							fill
							sizes='(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 250px'
							className='object-cover object-left-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]'
						/>
						<span className='absolute inset-0 bg-bg/0 transition-colors duration-300 group-hover:bg-bg/20' />
					</button>
				))}
			</div>

			{openIndex !== null && (
				<Lightbox
					images={images}
					index={openIndex}
					onIndexChange={setOpenIndex}
					onClose={() => setOpenIndex(null)}
				/>
			)}
		</>
	);
}

function Lightbox({
	images,
	index,
	onIndexChange,
	onClose,
}: {
	images: ProjectImage[];
	index: number;
	onIndexChange: (i: number) => void;
	onClose: () => void;
}) {
	const { t, lang } = useLanguage();
	const [zoom, setZoom] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
		null,
	);
	const moved = useRef(false);
	const [dragging, setDragging] = useState(false);

	const img = images[index];
	const hasMany = images.length > 1;

	const resetZoom = useCallback(() => {
		setZoom(1);
		setOffset({ x: 0, y: 0 });
	}, []);

	const changeZoom = useCallback((next: number) => {
		const z = clampZoom(next);
		setZoom(z);
		if (z === 1) setOffset({ x: 0, y: 0 });
	}, []);

	const go = useCallback(
		(dir: 1 | -1) => {
			if (!hasMany) return;
			onIndexChange((index + dir + images.length) % images.length);
			resetZoom();
		},
		[hasMany, index, images.length, onIndexChange, resetZoom],
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			else if (e.key === 'ArrowRight') go(1);
			else if (e.key === 'ArrowLeft') go(-1);
			else if (e.key === '+' || e.key === '=') changeZoom(zoom + ZOOM_STEP);
			else if (e.key === '-') changeZoom(zoom - ZOOM_STEP);
			else if (e.key === '0') resetZoom();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [go, onClose, changeZoom, resetZoom, zoom]);

	// Lock page scroll while the lightbox is open.
	useEffect(() => {
		const prev = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		return () => {
			document.documentElement.style.overflow = prev;
		};
	}, []);

	const onPointerDown = (e: React.PointerEvent) => {
		moved.current = false;
		if (zoom === 1) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
		setDragging(true);
	};

	const onPointerMove = (e: React.PointerEvent) => {
		const d = drag.current;
		if (!d) return;
		const dx = e.clientX - d.x;
		const dy = e.clientY - d.y;
		if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
		// Offset is applied before scale, so divide to keep the image under the pointer.
		setOffset({ x: d.ox + dx / zoom, y: d.oy + dy / zoom });
	};

	const onPointerUp = () => {
		drag.current = null;
		setDragging(false);
	};

	// Rendered into <body>: case study sections sit inside Reveal wrappers with a
	// transform, which would otherwise make `fixed` relative to that wrapper.
	return createPortal(
		<div
			role='dialog'
			aria-modal='true'
			aria-label={pick(img.alt, lang)}
			className='fixed inset-0 z-[90] flex flex-col bg-bg/95 backdrop-blur-sm'
		>
			<div className='flex items-center justify-between gap-3 px-[clamp(12px,3vw,32px)] py-4'>
				<span className='font-mono text-[11px] uppercase tracking-wide text-faint'>
					{index + 1} / {images.length}
				</span>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => changeZoom(zoom - ZOOM_STEP)}
						disabled={zoom <= MIN_ZOOM}
						aria-label={t.galleryZoomOut}
						className={ICON_BUTTON}
					>
						<span aria-hidden='true' className='text-xl leading-none'>
							−
						</span>
					</button>
					<button
						type='button'
						onClick={resetZoom}
						disabled={zoom === 1}
						aria-label={t.galleryZoomReset}
						className='h-11 min-w-[64px] rounded-full border border-ink/15 bg-card/80 px-3 font-mono text-[12px] text-ink backdrop-blur transition-colors hover:border-ink/40 disabled:opacity-60'
					>
						{Math.round(zoom * 100)}%
					</button>
					<button
						type='button'
						onClick={() => changeZoom(zoom + ZOOM_STEP)}
						disabled={zoom >= MAX_ZOOM}
						aria-label={t.galleryZoomIn}
						className={ICON_BUTTON}
					>
						<span aria-hidden='true' className='text-xl leading-none'>
							+
						</span>
					</button>
					<button
						type='button'
						onClick={onClose}
						aria-label={t.galleryClose}
						className={`${ICON_BUTTON} ml-2`}
						autoFocus
					>
						<span aria-hidden='true' className='text-lg leading-none'>
							✕
						</span>
					</button>
				</div>
			</div>

			<div
				className='relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-[clamp(12px,6vw,96px)]'
				onClick={(e) => {
					// Clicking the dimmed area (not the image) closes.
					if (e.target === e.currentTarget) onClose();
				}}
				onWheel={(e) => changeZoom(zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1))}
			>
				<div
					className={`relative h-full w-full touch-none select-none ${
						zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
					}`}
					style={{
						transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
						transition: dragging ? 'none' : 'transform 0.25s ease-out',
					}}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
					onClick={() => {
						if (moved.current) return; // end of a pan, not a click
						if (zoom === 1) changeZoom(2);
					}}
					onDoubleClick={resetZoom}
				>
					<Image
						key={img.src}
						src={img.src}
						alt={pick(img.alt, lang)}
						fill
						sizes='100vw'
						quality={90}
						draggable={false}
						className='object-contain'
						priority
					/>
				</div>

				{hasMany && (
					<>
						<ArrowButton
							dir={-1}
							label={t.galleryPrev}
							onClick={() => go(-1)}
							className='left-[clamp(8px,2vw,28px)]'
						/>
						<ArrowButton
							dir={1}
							label={t.galleryNext}
							onClick={() => go(1)}
							className='right-[clamp(8px,2vw,28px)]'
						/>
					</>
				)}
			</div>

			<div className='min-h-[56px] px-[clamp(12px,3vw,32px)] py-4 text-center text-sm text-muted'>
				{img.caption ? pick(img.caption, lang) : null}
			</div>
		</div>,
		document.body,
	);
}
