'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/common/language-provider';
import {
	CONSENT_OPEN_EVENT,
	GA_ID,
	getConsent,
	setConsent,
	type Consent,
} from '@/lib/analytics';

const buttonClassName =
	'flex-1 whitespace-nowrap rounded-full border border-ink/[0.14] bg-card-3 px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/40 hover:bg-card-2 md:flex-none md:px-6';

/**
 * Cookie consent banner. Shows on the first visit (when a GA Measurement ID is
 * configured) and again whenever the footer "Cookies" link is clicked. Accept
 * and Decline are deliberately styled the same — refusing must be as easy as
 * agreeing. Mounted in `app/(site)/layout.tsx`, next to `<Analytics />`.
 *
 * Phones: full-width card pinned to the bottom. Desktop (md+): a wide, short
 * bar centred at the bottom, text on the left and buttons on the right.
 */
export function CookieBanner() {
	const { t } = useLanguage();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (GA_ID && getConsent() === null) setOpen(true);

		const onOpen = () => setOpen(true);
		window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
		return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
	}, []);

	if (!open) return null;

	const choose = (consent: Consent) => {
		setConsent(consent);
		setOpen(false);
	};

	return (
		<section
			role='region'
			aria-label={t.cookieTitle}
			className='fixed inset-x-4 bottom-4 z-[60] animate-rise-in rounded-2xl border border-ink/[0.14] bg-card p-5 text-left shadow-[0_18px_60px_rgb(0_0_0/0.45)] md:inset-x-6 md:mx-auto md:flex md:max-w-[960px] md:items-center md:gap-8 md:px-6 md:py-4'
		>
			<div className='md:flex-1'>
				<p className='mb-1.5 font-mono text-[11px] uppercase tracking-wide text-faint'>
					{t.cookieTitle}
				</p>
				<p className='text-[13px] leading-relaxed text-muted-2'>
					{t.cookieText}{' '}
					<Link
						href='/privatnost'
						className='text-ink underline underline-offset-2 hover:text-accent'
					>
						{t.cookiePolicyLink}
					</Link>
				</p>
			</div>
			<div className='mt-4 flex gap-2.5 md:mt-0 md:shrink-0'>
				<button
					type='button'
					onClick={() => choose('denied')}
					className={buttonClassName}
				>
					{t.cookieReject}
				</button>
				<button
					type='button'
					onClick={() => choose('granted')}
					className={buttonClassName}
				>
					{t.cookieAccept}
				</button>
			</div>
		</section>
	);
}
