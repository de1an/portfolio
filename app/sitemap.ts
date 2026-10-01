import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/projects';
import { SITE_URL } from '@/lib/site';

// Match the case study pages: a newly published project shows up within the hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const projects = await getProjects();

	return [
		{ url: SITE_URL },
		...projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}` })),
	];
}
