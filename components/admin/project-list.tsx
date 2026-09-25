"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProject, togglePublished } from "@/app/(admin)/admin/actions";
import type { Project } from "@/lib/project-schema";
import { TYPE_LABELS } from "@/components/admin/type-labels";

export function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle(project: Project) {
    startTransition(async () => {
      await togglePublished(project.id, project.slug, !project.published);
      router.refresh();
    });
  }

  function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteProject(project.id, project.slug);
      router.refresh();
    });
  }

  if (projects.length === 0) {
    return <p className="text-sm text-muted">No projects yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-faint">
            <th className="py-2 pr-4">Order</th>
            <th className="py-2 pr-4">Title</th>
            <th className="py-2 pr-4">Type</th>
            <th className="py-2 pr-4">Case study</th>
            <th className="py-2 pr-4">Published</th>
            <th className="py-2 pr-4"></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-ink/[0.06]">
              <td className="py-2.5 pr-4 font-mono text-xs text-muted">{project.sortOrder}</td>
              <td className="py-2.5 pr-4 font-medium">{project.title}</td>
              <td className="py-2.5 pr-4 text-muted">{TYPE_LABELS[project.typeKey]}</td>
              <td className="py-2.5 pr-4 text-muted">{project.hasCaseStudy ? "Yes" : "—"}</td>
              <td className="py-2.5 pr-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggle(project)}
                  className={`rounded-full px-2.5 py-1 text-xs uppercase tracking-wide ${
                    project.published ? "bg-accent/20 text-accent-dim" : "bg-card-2 text-faint"
                  }`}
                >
                  {project.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="py-2.5 pr-4">
                <div className="flex items-center gap-3">
                  <Link href={`/admin/projects/${project.id}`} className="text-accent-dim hover:underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(project)}
                    className="text-red-400 hover:underline disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
