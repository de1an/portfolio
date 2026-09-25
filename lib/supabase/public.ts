import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Anonymous, cookie-free Supabase client for public reads. RLS restricts it
 * to published rows, so it's safe to use from build-time contexts —
 * generateStaticParams, generateMetadata prefetches — where next/headers'
 * cookies() isn't available. Admin reads use lib/supabase/server.ts instead.
 */
export function createClient() {
	return createSupabaseClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
	);
}
