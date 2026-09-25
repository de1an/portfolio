import { CustomCursor } from '@/components/common/custom-cursor';
import { AmbientBackground } from '@/components/common/ambient-background';
import { Nav } from '@/components/nav';
import Footer from '@/components/Footer';

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
			<Footer />
		</>
	);
}
