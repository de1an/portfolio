'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/common/language-provider';
import { CaseStudySection } from '@/components/common/case-study-section';
import { openConsentSettings } from '@/lib/analytics';
import type { Lang } from '@/lib/i18n';

const CONTACT_EMAIL = 'dejan.lukic98@gmail.com';

/** Bump this whenever the policy text changes. */
const UPDATED: Record<Lang, string> = {
	sr: '24. oktobar 2026.',
	en: 'October 24, 2026',
};

type Block =
	| { type: 'p'; text: React.ReactNode }
	| { type: 'list'; items: React.ReactNode[] };

type PolicySection = { heading: string; blocks: Block[] };

const mail = (
	<a
		href={`mailto:${CONTACT_EMAIL}`}
		className='text-ink underline underline-offset-2 hover:text-accent'
	>
		{CONTACT_EMAIL}
	</a>
);

const cookiesButton = (label: string) => (
	<button
		type='button'
		onClick={openConsentSettings}
		className='text-ink underline underline-offset-2 hover:text-accent'
	>
		{label}
	</button>
);

const CONTENT: Record<
	Lang,
	{
		title: string;
		updatedLabel: string;
		intro: string;
		sections: PolicySection[];
	}
> = {
	sr: {
		title: 'Politika privatnosti',
		updatedLabel: 'Poslednje ažuriranje',
		intro:
			'Ova stranica objašnjava koje podatke o ličnosti sajt dejanlukic.in.rs prikuplja, zašto, koliko dugo ih čuva i koja prava imate u skladu sa Zakonom o zaštiti podataka o ličnosti Republike Srbije i Opštom uredbom o zaštiti podataka EU (GDPR).',
		sections: [
			{
				heading: 'Rukovalac podacima',
				blocks: [
					{
						type: 'p',
						text: (
							<>
								Rukovalac podacima je Dejan Lukić. Za sva pitanja u vezi sa
								vašim podacima možete me kontaktirati na {mail}.
							</>
						),
					},
				],
			},
			{
				heading: 'Kontakt forma',
				blocks: [
					{
						type: 'p',
						text: 'Kada pošaljete poruku preko kontakt forme, prikupljam ime, email adresu i tekst poruke koje ste uneli. Koristim ih isključivo da bih odgovorio na vaš upit i eventualno dogovorio saradnju.',
					},
					{
						type: 'list',
						items: [
							'Pravni osnov: preduzimanje radnji na vaš zahtev i moj legitimni interes da odgovorim na upit.',
							'Poruka se ne čuva u bazi podataka na sajtu — prosleđuje se na moj email putem servisa Resend (Resend, Inc.).',
							'Podatke čuvam dok traje komunikacija i eventualna saradnja, a brišem ih na vaš zahtev ili kada više nisu potrebni.',
						],
					},
				],
			},
			{
				heading: 'Google Analytics',
				blocks: [
					{
						type: 'p',
						text: 'Ako to dozvolite u baneru za kolačiće, sajt koristi Google Analytics 4 (Google Ireland Limited / Google LLC) da bih video kako posetioci koriste sajt. Bez vašeg pristanka Google Analytics se uopšte ne učitava.',
					},
					{
						type: 'list',
						items: [
							'Šta se meri: posećene stranice i sekcije, vreme provedeno na sajtu, izvor posete, tip uređaja i browsera, približna lokacija (zemlja/grad), klikovi na dugmad, promena jezika i uspešno slanje kontakt forme.',
							'Google Analytics 4 ne beleži i ne čuva IP adrese. Google signali i reklamne funkcije su isključeni.',
							'Kolačići: _ga i _ga_<ID>, sa trajanjem do 2 godine.',
							'Podaci se u Google Analytics-u čuvaju 14 meseci.',
							'Pravni osnov: vaš pristanak, koji možete povući u bilo kom trenutku.',
						],
					},
				],
			},
			{
				heading: 'Hosting i tehnički podaci',
				blocks: [
					{
						type: 'p',
						text: 'Sajt je hostovan na platformi Vercel (Vercel Inc.). Prilikom svake posete server kratkotrajno beleži tehničke podatke kao što su IP adresa, tip browsera i vreme zahteva, radi bezbednosti i ispravnog rada sajta. Pravni osnov je legitimni interes.',
					},
				],
			},
			{
				heading: 'Lokalno skladište u browseru',
				blocks: [
					{
						type: 'p',
						text: 'Sajt u vašem browseru (localStorage) pamti izabrani jezik i vaš izbor u vezi sa kolačićima. Ovi podaci ostaju na vašem uređaju, nikome se ne šalju i neophodni su za rad sajta, pa za njih nije potreban pristanak.',
					},
				],
			},
			{
				heading: 'Iznošenje podataka van Srbije',
				blocks: [
					{
						type: 'p',
						text: 'Google, Vercel i Resend mogu obrađivati podatke i van Srbije i EU, uključujući SAD. Ovi pružaoci usluga obezbeđuju odgovarajuće mere zaštite, kao što su standardne ugovorne klauzule.',
					},
				],
			},
			{
				heading: 'Vaša prava',
				blocks: [
					{
						type: 'p',
						text: 'U vezi sa vašim podacima imate pravo na:',
					},
					{
						type: 'list',
						items: [
							'pristup podacima i kopiju podataka,',
							'ispravku netačnih podataka,',
							'brisanje podataka,',
							'ograničenje obrade i prigovor na obradu,',
							'prenosivost podataka,',
							<>
								povlačenje pristanka u bilo kom trenutku — preko linka{' '}
								{cookiesButton('Kolačići')} na dnu stranice.
							</>,
						],
					},
					{
						type: 'p',
						text: (
							<>
								Zahtev možete poslati na {mail}. Takođe imate pravo da podnesete
								pritužbu Povereniku za informacije od javnog značaja i zaštitu
								podataka o ličnosti (
								<a
									href='https://www.poverenik.rs'
									target='_blank'
									rel='noopener noreferrer'
									className='text-ink underline underline-offset-2 hover:text-accent'
								>
									poverenik.rs
								</a>
								).
							</>
						),
					},
				],
			},
			{
				heading: 'Izmene politike',
				blocks: [
					{
						type: 'p',
						text: 'Ova politika može biti izmenjena ako se promeni način na koji sajt obrađuje podatke. Datum poslednje izmene uvek je naveden na vrhu stranice.',
					},
				],
			},
		],
	},
	en: {
		title: 'Privacy policy',
		updatedLabel: 'Last updated',
		intro:
			'This page explains what personal data dejanlukic.in.rs collects, why, how long it is kept and what rights you have under the Serbian Law on Personal Data Protection and the EU General Data Protection Regulation (GDPR).',
		sections: [
			{
				heading: 'Data controller',
				blocks: [
					{
						type: 'p',
						text: (
							<>
								The data controller is Dejan Lukić. For any question about your
								data, contact me at {mail}.
							</>
						),
					},
				],
			},
			{
				heading: 'Contact form',
				blocks: [
					{
						type: 'p',
						text: 'When you send a message through the contact form, I collect the name, email address and message you entered. I use them only to reply to your enquiry and, if relevant, to arrange working together.',
					},
					{
						type: 'list',
						items: [
							'Legal basis: taking steps at your request and my legitimate interest in replying to your enquiry.',
							'The message is not stored in a database on this site — it is forwarded to my email through Resend (Resend, Inc.).',
							'I keep this data for as long as our conversation and any collaboration last, and delete it on request or once it is no longer needed.',
						],
					},
				],
			},
			{
				heading: 'Google Analytics',
				blocks: [
					{
						type: 'p',
						text: 'If you allow it in the cookie banner, this site uses Google Analytics 4 (Google Ireland Limited / Google LLC) to understand how visitors use the site. Without your consent, Google Analytics is not loaded at all.',
					},
					{
						type: 'list',
						items: [
							'What is measured: pages and sections viewed, time on site, traffic source, device and browser type, approximate location (country/city), button clicks, language changes and successful contact form submissions.',
							'Google Analytics 4 does not log or store IP addresses. Google signals and advertising features are turned off.',
							'Cookies: _ga and _ga_<ID>, lasting up to 2 years.',
							'Data is kept in Google Analytics for 14 months.',
							'Legal basis: your consent, which you can withdraw at any time.',
						],
					},
				],
			},
			{
				heading: 'Hosting and technical data',
				blocks: [
					{
						type: 'p',
						text: 'The site is hosted on Vercel (Vercel Inc.). On every visit the server briefly logs technical data such as IP address, browser type and request time, for security and to keep the site running. The legal basis is legitimate interest.',
					},
				],
			},
			{
				heading: 'Local browser storage',
				blocks: [
					{
						type: 'p',
						text: 'The site stores your chosen language and your cookie choice in your browser (localStorage). This data stays on your device, is never sent anywhere and is necessary for the site to work, so it does not require consent.',
					},
				],
			},
			{
				heading: 'Transfers outside Serbia',
				blocks: [
					{
						type: 'p',
						text: 'Google, Vercel and Resend may process data outside Serbia and the EU, including in the United States. These providers apply appropriate safeguards such as standard contractual clauses.',
					},
				],
			},
			{
				heading: 'Your rights',
				blocks: [
					{
						type: 'p',
						text: 'Regarding your data, you have the right to:',
					},
					{
						type: 'list',
						items: [
							'access your data and get a copy of it,',
							'have inaccurate data corrected,',
							'have your data deleted,',
							'restrict or object to processing,',
							'data portability,',
							<>
								withdraw consent at any time — via the{' '}
								{cookiesButton('Cookies')} link at the bottom of the page.
							</>,
						],
					},
					{
						type: 'p',
						text: (
							<>
								Send requests to {mail}. You also have the right to lodge a
								complaint with the Serbian Commissioner for Information of
								Public Importance and Personal Data Protection (
								<a
									href='https://www.poverenik.rs'
									target='_blank'
									rel='noopener noreferrer'
									className='text-ink underline underline-offset-2 hover:text-accent'
								>
									poverenik.rs
								</a>
								).
							</>
						),
					},
				],
			},
			{
				heading: 'Changes to this policy',
				blocks: [
					{
						type: 'p',
						text: 'This policy may change if the way the site processes data changes. The date of the latest change is always shown at the top of the page.',
					},
				],
			},
		],
	},
};

/** The /privatnost page body. Bilingual like the rest of the site, following the EN/SR toggle. */
export function PrivacyView() {
	const { t, lang } = useLanguage();
	const c = CONTENT[lang];

	return (
		<>
			<div className='px-[clamp(18px,4vw,56px)] pt-[clamp(90px,11vh,130px)]'>
				<div className='mx-auto w-full max-w-[1320px]'>
					<Link
						href='/'
						className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-faint transition-colors hover:text-ink'
					>
						<span aria-hidden='true'>←</span> {t.dotHome}
					</Link>
				</div>
			</div>

			<CaseStudySection noBorder>
				<div className='max-w-[72ch]'>
					<h1 className='font-display text-[clamp(32px,5vw,64px)] leading-[1.12]'>
						{c.title}
					</h1>
					<p className='mt-3 font-mono text-[11px] uppercase tracking-wide text-faint'>
						{c.updatedLabel}: {UPDATED[lang]}
					</p>
					<p className='mt-6 text-[clamp(15px,1.4vw,18px)] leading-[1.6] text-muted text-pretty'>
						{c.intro}
					</p>

					{c.sections.map((section) => (
						<section key={section.heading} className='mt-10'>
							<h2 className='mb-3 text-[clamp(18px,1.8vw,22px)] font-semibold tracking-[-0.01em]'>
								{section.heading}
							</h2>
							{section.blocks.map((block, i) =>
								block.type === 'p' ? (
									<p
										key={i}
										className='mt-3 text-[15px] leading-relaxed text-muted text-pretty'
									>
										{block.text}
									</p>
								) : (
									<ul
										key={i}
										className='mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted marker:text-faint'
									>
										{block.items.map((item, j) => (
											<li key={j}>{item}</li>
										))}
									</ul>
								),
							)}
						</section>
					))}
				</div>
			</CaseStudySection>
		</>
	);
}
