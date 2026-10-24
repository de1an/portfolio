import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { PrivacyView } from '@/components/sections/privacy-view';

export const metadata: Metadata = {
	title: 'Politika privatnosti — Dejan Lukić',
	description:
		'Koje podatke sajt prikuplja, zašto, koliko dugo ih čuva i koja su vaša prava.',
};

export default function PrivacyPage() {
	return (
		<>
			<PrivacyView />
			<Footer />
		</>
	);
}
