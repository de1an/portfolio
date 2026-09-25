import { Hero } from "@/components/sections/hero";
import { Service } from "@/components/sections/service";
import { About } from "@/components/sections/about";
import { Work } from "@/components/sections/work";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { ScrollSnapController } from "@/components/common/scroll-snap-controller";
import { SectionDotRail } from "@/components/common/section-dot-rail";
import { getProjects } from "@/lib/projects";

export const revalidate = 3600;

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <ScrollSnapController />
      <SectionDotRail />
      <Hero />
      <Service />
      <Work projects={projects} />
      <About />
      <Experience />
      <Contact />
    </>
  );
}
