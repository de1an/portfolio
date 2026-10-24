/**
 * Google Analytics 4 — consent-aware helpers.
 *
 * "Basic" Consent Mode: gtag.js is not loaded at all until the visitor accepts
 * analytics cookies (see `components/common/analytics.tsx`). Nothing is sent
 * to Google before that, and GA never runs outside production builds.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** True only in a production build with a Measurement ID configured. */
export const analyticsEnabled =
	process.env.NODE_ENV === 'production' && Boolean(GA_ID);

export type Consent = 'granted' | 'denied';

export const CONSENT_STORAGE_KEY = 'cookie-consent';
/** Fired on `window` whenever the visitor changes their choice. */
export const CONSENT_EVENT = 'cookie-consent-change';
/** Fired on `window` to reopen the cookie banner (footer "Cookies" link). */
export const CONSENT_OPEN_EVENT = 'cookie-consent-open';

/** Reopens the cookie banner so the visitor can change their choice. */
export function openConsentSettings() {
	window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

/** The visitor's saved choice, or `null` if they haven't decided yet. */
export function getConsent(): Consent | null {
	try {
		const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
		return saved === 'granted' || saved === 'denied' ? saved : null;
	} catch {
		return null;
	}
}

/** Saves the choice, updates GA if it's already loaded, and notifies listeners. */
export function setConsent(consent: Consent) {
	try {
		localStorage.setItem(CONSENT_STORAGE_KEY, consent);
	} catch {
		// localStorage unavailable — the choice lasts for this page view only
	}

	// GA's official opt-out flag: while true, gtag.js sends nothing at all
	// (not even cookieless pings) for this property, until the page reloads.
	if (GA_ID) {
		(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] =
			consent === 'denied';
	}
	window.gtag?.('consent', 'update', { analytics_storage: consent });
	if (consent === 'denied') clearGaCookies();

	window.dispatchEvent(
		new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }),
	);
}

type EventParams = Record<string, string | number | boolean>;

let initialized = false;
/** Events fired (with consent) before `initGtag()` ran — e.g. the first section_view on mount. */
const pending: [string, EventParams | undefined][] = [];

/**
 * Sets up `window.gtag` and the GA config. Called by `<Analytics />` once
 * consent is granted, right before gtag.js itself is loaded; commands queue in
 * `dataLayer` until the library arrives.
 */
export function initGtag() {
	if (initialized || !GA_ID) return;
	initialized = true;

	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag() {
		// gtag.js expects the raw `arguments` object, not an array.
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer!.push(arguments);
	};

	window.gtag('consent', 'default', {
		analytics_storage: 'granted',
		ad_storage: 'denied',
		ad_user_data: 'denied',
		ad_personalization: 'denied',
	});
	window.gtag('js', new Date());
	window.gtag('config', GA_ID);

	pending
		.splice(0)
		.forEach(([name, params]) => window.gtag!('event', name, params));
}

/**
 * Sends a GA4 event. Without consent (or after it's withdrawn) it's dropped;
 * with consent but before GA is initialised it's queued and sent right after
 * `initGtag()`.
 */
export function trackEvent(name: string, params?: EventParams) {
	if (!analyticsEnabled || getConsent() !== 'granted') return;
	if (window.gtag) window.gtag('event', name, params);
	else pending.push([name, params]);
}

/** Removes `_ga` / `_ga_<id>` cookies after consent is withdrawn. */
function clearGaCookies() {
	const names = document.cookie
		.split(';')
		.map((c) => c.split('=')[0].trim())
		.filter((name) => name === '_ga' || name.startsWith('_ga_'));
	if (!names.length) return;

	// GA sets cookies on the widest allowed domain, so try every parent domain.
	const parts = location.hostname.split('.');
	const domains = [''];
	for (let i = 0; i < parts.length - 1; i++) {
		domains.push(`; domain=.${parts.slice(i).join('.')}`);
	}

	names.forEach((name) =>
		domains.forEach((domain) => {
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
		}),
	);
}
