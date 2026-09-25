'use client';

import { useLanguage } from '@/components/common/language-provider';

export default function Footer() {
	const { t } = useLanguage();
	const year = new Date().getFullYear();

	return (
		<div className='relative z-[1] w-full px-[clamp(18px,4vw,56px)] pb-[clamp(24px,4vh,40px)]'>
			<div className='mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-3 border-t border-ink/[0.09] pt-5 font-mono text-[11px] uppercase tracking-wide text-faint'>
				<span>© {year} Dejan Lukić</span>
				<span>{t.footerRight}</span>
			</div>
		</div>
	);
}
