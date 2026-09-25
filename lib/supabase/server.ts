import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client for server components, server actions and route
 * handlers. Cookie writes are wrapped in try/catch because Server Components
 * can't set cookies — session refresh there is a no-op and relies on
 * middleware having already refreshed the cookie on the request.
 */
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options),
						);
					} catch {
						// Called from a Server Component — session refresh is handled by middleware.
					}
				},
			},
		},
	);
}
