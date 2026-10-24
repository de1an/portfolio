'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import {
	CONSENT_EVENT,
	GA_ID,
	analyticsEnabled,
	getConsent,
	initGtag,
	type Consent,
} from '@/lib/analytics';

/**
 * Loads Google Analytics 4 — only in production, only on the public site
 * (mounted in `app/(site)/layout.tsx`, so `/admin` is never tracked), and only
 * after the visitor has accepted analytics cookies. Client-side navigations
 * are picked up by GA4's enhanced measurement ("page changes based on browser
 * history events"), so no manual page_view calls are needed.
 */
export function Analytics() {
	const [consent, setConsentState] = useState<Consent | null>(null);

	useEffect(() => {
		setConsentState(getConsent());

		const onChange = (event: Event) =>
			setConsentState((event as CustomEvent<Consent>).detail);
		window.addEventListener(CONSENT_EVENT, onChange);
		return () => window.removeEventListener(CONSENT_EVENT, onChange);
	}, []);

	const active = analyticsEnabled && consent === 'granted';

	useEffect(() => {
		if (active) initGtag();
	}, [active]);

	// Once loaded, gtag.js stays on the page; withdrawing consent later is
	// handled by `setConsent('denied')`, which switches GA to denied mode.
	if (!active) return null;

	return (
		<Script
			id='ga-lib'
			src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
			strategy='afterInteractive'
		/>
	);
}
