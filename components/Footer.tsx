'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/common/language-provider';
import { openConsentSettings } from '@/lib/analytics';

/** `embedded` drops the footer's own horizontal padding, for when it sits inside a padded section. */
export default function Footer({ embedded }: { embedded?: boolean }) {
	const { t } = useLanguage();
	const year = new Date().getFullYear();

	return (
		<div
			className={`relative z-[1] w-full ${
				embedded
					? 'pb-[clamp(16px,3vh,28px)]'
					: 'px-[clamp(18px,4vw,56px)] pb-[clamp(24px,4vh,40px)]'
			}`}
		>
			<div
				className={`mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-3 border-t border-ink/[0.09] font-mono text-[11px] uppercase tracking-wide text-faint ${
					embedded ? 'pt-4' : 'pt-5'
				}`}
			>
				<div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
					<span>© {year} Dejan Lukić</span>
					<Link href='/privatnost' className='transition-colors hover:text-ink'>
						{t.footerPrivacy}
					</Link>
					<button
						type='button'
						onClick={openConsentSettings}
						className='uppercase tracking-wide transition-colors hover:text-ink'
					>
						{t.footerCookies}
					</button>
				</div>
				<span>{t.footerRight}</span>
			</div>
		</div>
	);
}
