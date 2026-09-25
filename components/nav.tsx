'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/common/language-provider';
import type { Lang } from '@/lib/i18n';

export function Nav() {
	const { lang, setLang } = useLanguage();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () =>
			setScrolled(window.scrollY > window.innerHeight * 0.55);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<nav
			className={`fixed inset-x-0 top-0 z-50 border-b border-ink/[0.09] px-[clamp(18px,4vw,56px)] backdrop-blur-md transition-colors duration-500 ${
				scrolled ? 'bg-bg/[0.94]' : 'bg-bg/[0.86]'
			}`}
		>
			<div
				className={`mx-auto flex w-full max-w-[1320px] items-center justify-between gap-5 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
					scrolled ? 'py-[7px]' : 'py-3.5'
				}`}
			>
				<Link
					href='/#top'
					className='whitespace-nowrap font-display text-[clamp(15px,1.4vw,19px)] uppercase tracking-wide'
				>
					Dejan Lukić
				</Link>

				<div className='flex items-center gap-[clamp(12px,2.2vw,30px)] text-[13px] uppercase tracking-wide'>
					<div className='flex items-center gap-0.5 rounded-full border border-ink/[0.14] p-1 font-mono text-[11px] tracking-wide'>
						<LangButton lang='en' active={lang === 'en'} onSelect={setLang} />
						<LangButton lang='sr' active={lang === 'sr'} onSelect={setLang} />
					</div>

					<Link
						href='mailto:dejan.lukic98@gmail.com'
						className='hidden items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 py-2.5 font-medium normal-case text-bg transition-colors hover:bg-muted-2 md:flex'
					>
						dejan.lukic98@gmail.com
					</Link>
				</div>
			</div>
		</nav>
	);
}

function LangButton({
	lang,
	active,
	onSelect,
}: {
	lang: Lang;
	active: boolean;
	onSelect: (lang: Lang) => void;
}) {
	return (
		<button
			type='button'
			onClick={() => onSelect(lang)}
			className={`rounded-full px-2.5 py-1.5 tracking-wide ${
				active ? 'bg-ink text-bg' : 'text-faint'
			}`}
		>
			{lang.toUpperCase()}
		</button>
	);
}
