import { CaseStudyGallery } from '@/components/sections/case-study-gallery';

const img = (n: number) => ({
	src: '/portrait.png',
	width: 800,
	height: 1000,
	alt: { en: `Test ${n}`, sr: `Test ${n}` },
});

export default function Page() {
	return (
		<div className='p-24'>
			<CaseStudyGallery images={[img(1), img(2), img(3)]} />
		</div>
	);
}
