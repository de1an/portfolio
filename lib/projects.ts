import { cache } from "react";
import { createClient as createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { projectSchema, type Project } from "@/lib/project-schema";

export type {
  Project,
  ProjectInput,
  Localized,
  ProjectImage,
  CaseStudy,
  ProjectTypeKey,
  ProjectStatus,
} from "@/lib/project-schema";
export { pick, PROJECT_TYPE_KEYS, STATUS_VALUES } from "@/lib/project-schema";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  type_key: string;
  sort_order: number;
  published: boolean;
  tech: string[] | null;
  summary: unknown;
  cover: unknown;
  has_case_study: boolean;
  year: string | null;
  role: unknown;
  client: string | null;
  scope: unknown;
  status: string | null;
  url: string | null;
  context: unknown;
  challenges: unknown;
  delivered: unknown;
  timeline: unknown;
  metrics: unknown;
  stack: unknown;
  gallery: unknown;
  note: unknown;
};

/** Maps a raw DB row (snake_case) to the app's Project shape, validating along the way. */
function rowToProject(row: ProjectRow): Project | null {
  const candidate = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    typeKey: row.type_key,
    sortOrder: row.sort_order,
    published: row.published,
    tech: row.tech ?? [],
    summary: row.summary,
    cover: row.cover ?? undefined,
    hasCaseStudy: row.has_case_study,
    caseStudy: row.has_case_study
      ? {
          year: row.year,
          role: row.role,
          client: row.client ?? undefined,
          scope: row.scope ?? undefined,
          status: row.status ?? undefined,
          url: row.url ?? undefined,
          context: row.context,
          challenges: row.challenges,
          delivered: row.delivered,
          timeline: row.timeline,
          metrics: row.metrics,
          stack: row.stack,
          gallery: row.gallery,
          note: row.note ?? undefined,
        }
      : undefined,
  };

  const parsed = projectSchema.safeParse(candidate);
  if (!parsed.success) {
    console.error(`Skipping invalid project row (slug: ${row.slug}):`, parsed.error.flatten());
    return null;
  }
  return parsed.data;
}

/** Published projects, in display order. Public pages use this. */
export const getProjects = cache(async (): Promise<Project[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load projects:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => rowToProject(row as ProjectRow))
    .filter((p): p is Project => p !== null);
});

/** A single published project by slug, or null if missing/unpublished/invalid. */
export const getProject = cache(async (slug: string): Promise<Project | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return rowToProject(data as ProjectRow);
});

/** The next project (by sort_order, wrapping around) that has a case study — for the "next" link. */
export async function getAdjacentProject(slug: string): Promise<Project | null> {
  const all = await getProjects();
  if (all.length < 2) return null; // nothing else to link to
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return all[0];
  return all[(idx + 1) % all.length];
}

/**
 * All projects regardless of published status — for the admin list. Relying
 * on RLS to enforce that only the authenticated admin can actually see drafts;
 * an anonymous caller gets the same published-only rows as getProjects().
 */
export async function getProjectsForAdmin(): Promise<Project[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load projects for admin:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => rowToProject(row as ProjectRow))
    .filter((p): p is Project => p !== null);
}

/** A single project by id, published or not — for the admin edit form. */
export async function getProjectByIdForAdmin(id: string): Promise<Project | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (error || !data) return null;
  return rowToProject(data as ProjectRow);
}
