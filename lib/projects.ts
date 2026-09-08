export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
};

export const projects: Project[] = [
  {
    slug: "example-project",
    title: "Example Project",
    description: "Replace this with a real project description.",
    tags: ["Next.js", "TypeScript"],
    url: "https://github.com",
  },
];
