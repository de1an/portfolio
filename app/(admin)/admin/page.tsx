import Link from "next/link";
import { ProjectList } from "@/components/admin/project-list";
import { getProjectsForAdmin } from "@/lib/projects";
import { signOutAction } from "@/app/(admin)/admin/actions";

export default async function AdminPage() {
  const projects = await getProjectsForAdmin();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl uppercase">Projects</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects/new"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-muted-2"
          >
            New project
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="text-sm text-muted hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
