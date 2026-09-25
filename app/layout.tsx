import type { Metadata } from 'next';
import { Anton, Archivo } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/common/language-provider';

const anton = Anton({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-anton',
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
				className={`${anton.variable} ${archivo.variable} font-sans text-ink`}
				suppressHydrationWarning
			>
				<LanguageProvider>{children}</LanguageProvider>
			</body>
		</html>
	);
}
