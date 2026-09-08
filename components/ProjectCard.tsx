import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const content = (
    <>
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {project.description}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2 text-xs">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800"
          >
            {tag}
          </li>
        ))}
      </ul>
    </>
  );

  const className =
    "block rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600";

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
