import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/sections/case-study-view";
import { getAdjacentProject, getProject, getProjects } from "@/lib/projects";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  // Metadata is English-only: the language switch is client-side (localStorage),
  // so the server has no locale to pick from at request time.
  return {
    title: `${project.title} — Dejan Lukić`,
    description: project.summary.en,
    openGraph: project.cover
      ? {
          images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height }],
        }
      : undefined,
  };
}

export default async function WorkCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const next = await getAdjacentProject(slug);

  return <CaseStudyView project={project} next={next} />;
}
