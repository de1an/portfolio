'use client';

import { useEffect, useRef } from 'react';

/** A small ring that follows the pointer and replaces the system cursor (pointer-fine devices only). */
export function CustomCursor() {
	const dotRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const dot = dotRef.current;
		if (!dot || !window.matchMedia('(pointer: fine)').matches) return;

		document.body.setAttribute('data-cursor', 'on');

		let x = window.innerWidth / 2;
		let y = window.innerHeight / 2;
		let tx = x;
		let ty = y;
		let raf = 0;

		const loop = () => {
			x += (tx - x) * 0.18;
			y += (ty - y) * 0.18;
			dot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
			raf = requestAnimationFrame(loop);
		};

		const grow = (on: boolean) => {
			dot.style.width = on ? '46px' : '14px';
			dot.style.height = on ? '46px' : '14px';
			dot.style.margin = on ? '-23px 0 0 -23px' : '-7px 0 0 -7px';
			dot.style.background = on
				? 'rgb(var(--ink-rgb) / 0.14)'
				: 'rgb(var(--ink-rgb) / 0.1)';
			dot.style.borderColor = on
				? 'rgb(var(--ink-rgb) / 0.8)'
				: 'rgb(var(--ink-rgb) / 0.55)';
		};

		const onMove = (e: MouseEvent) => {
			tx = e.clientX;
			ty = e.clientY;
			dot.style.opacity = '1';
			const target = e.target as HTMLElement | null;
			grow(Boolean(target?.closest('a,button,[data-rail]')));
		};

		const onLeave = () => {
			dot.style.opacity = '0';
		};

		window.addEventListener('mousemove', onMove);
		document.addEventListener('mouseleave', onLeave);
		raf = requestAnimationFrame(loop);

		return () => {
			window.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseleave', onLeave);
			cancelAnimationFrame(raf);
			document.body.removeAttribute('data-cursor');
		};
	}, []);

	return (
		<div
			ref={dotRef}
			aria-hidden='true'
			className='pointer-events-none fixed left-0 top-0 z-[99] h-3.5 w-3.5 -ml-[7px] -mt-[7px] rounded-full border opacity-0 transition-[opacity,width,height,margin,background,border-color] duration-300'
			style={{
				borderColor: 'rgb(var(--ink-rgb) / 0.55)',
				background: 'rgb(var(--ink-rgb) / 0.1)',
			}}
		/>
	);
}
