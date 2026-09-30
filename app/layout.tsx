import type { Metadata } from 'next';
import { Archivo, Poppins } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/common/language-provider';

const poppins = Poppins({
	subsets: ['latin', 'latin-ext'],
	weight: '800',
	variable: '--font-poppins',
});

const archivo = Archivo({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	variable: '--font-archivo',
});

export const metadata: Metadata = {
	title: 'Dejan Lukić — Software Developer',
	description: 'Digital solutions that make a difference.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${poppins.variable} ${archivo.variable} font-sans text-ink`}
				suppressHydrationWarning
			>
				<LanguageProvider>{children}</LanguageProvider>
			</body>
		</html>
	);
}
