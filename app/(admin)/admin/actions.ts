'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { projectInputSchema, type ProjectInput } from '@/lib/project-schema';

/**
 * Re-checks the admin email server-side. Middleware already gates /admin, but
 * a server action can be invoked directly, so this is a second, independent
 * check — RLS is the third and final one at the database level.
 */
async function requireAdmin() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user || user.email !== process.env.ADMIN_EMAIL) {
		throw new Error('Not authorized');
	}
	return supabase;
}

function inputToRow(input: ProjectInput) {
	const cs = input.caseStudy;
	return {
		slug: input.slug,
		title: input.title,
		type_key: input.typeKey,
		sort_order: input.sortOrder,
		published: input.published,
		tech: input.tech ?? [],
		summary: input.summary,
		cover: input.cover ?? null,
		has_case_study: input.hasCaseStudy,
		year: cs?.year ?? null,
		role: cs?.role ?? null,
		client: cs?.client ?? null,
		scope: cs?.scope ?? null,
		status: cs?.status ?? null,
		url: cs?.url ?? null,
		context: cs?.context ?? [],
		challenges: cs?.challenges ?? [],
		delivered: cs?.delivered ?? [],
		timeline: cs?.timeline ?? [],
		metrics: cs?.metrics ?? [],
		stack: cs?.stack ?? [],
		gallery: cs?.gallery ?? [],
		note: cs?.note ?? null,
	};
}

export type SaveProjectIssue = { path: (string | number)[]; message: string };
export type SaveProjectResult =
	| { ok: true; slug: string }
	| { ok: false; error: string; issues: SaveProjectIssue[] };

export async function saveProject(
	id: string | null,
	raw: unknown,
): Promise<SaveProjectResult> {
	const supabase = await requireAdmin();

	const parsed = projectInputSchema.safeParse(raw);
	if (!parsed.success) {
		const issues = parsed.error.issues.map((issue) => ({
			path: issue.path as (string | number)[],
			message: issue.message,
		}));
		return {
			ok: false,
			error: issues.map((issue) => issue.message).join('; '),
			issues,
		};
	}

	const row = inputToRow(parsed.data);
	const { error } = id
		? await supabase.from('projects').update(row).eq('id', id)
		: await supabase.from('projects').insert(row);

	if (error) return { ok: false, error: error.message, issues: [] };

	revalidatePath('/');
	revalidatePath(`/work/${parsed.data.slug}`);
	revalidatePath('/admin');

	return { ok: true, slug: parsed.data.slug };
}

export async function deleteProject(id: string, slug: string): Promise<void> {
	const supabase = await requireAdmin();
	const { error } = await supabase.from('projects').delete().eq('id', id);
	if (error) throw new Error(error.message);

	revalidatePath('/');
	revalidatePath(`/work/${slug}`);
	revalidatePath('/admin');
}

export async function togglePublished(
	id: string,
	slug: string,
	published: boolean,
): Promise<void> {
	const supabase = await requireAdmin();
	const { error } = await supabase
		.from('projects')
		.update({ published })
		.eq('id', id);
	if (error) throw new Error(error.message);

	revalidatePath('/');
	revalidatePath(`/work/${slug}`);
	revalidatePath('/admin');
}

export async function signOutAction(): Promise<void> {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect('/admin/login');
}
