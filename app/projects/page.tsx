import { projects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

export const metadata = {
  title: "Projects | Portfolio",
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Projects</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
