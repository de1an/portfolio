import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// /admin is kept out of the index with a noindex meta tag (see app/(admin)/layout.tsx),
// not a Disallow here: a crawler blocked by robots.txt never sees the noindex tag.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: '*', allow: '/', disallow: '/api/' },
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
