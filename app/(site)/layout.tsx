import { CustomCursor } from '@/components/common/custom-cursor';
import { AmbientBackground } from '@/components/common/ambient-background';
import { Nav } from '@/components/nav';
import { Analytics } from '@/components/common/analytics';
import { CookieBanner } from '@/components/common/cookie-banner';

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<CustomCursor />
			<AmbientBackground />
			<Nav />
			<main>{children}</main>
			<Analytics />
			<CookieBanner />
		</>
	);
}
