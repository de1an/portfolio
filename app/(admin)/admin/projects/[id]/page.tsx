import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectByIdForAdmin } from "@/lib/projects";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectByIdForAdmin(id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 font-display text-2xl uppercase">Edit {project.title}</h1>
      <ProjectForm project={project} />
    </div>
  );
}
