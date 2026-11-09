import { Suspense } from "react";
import { SiteContainer } from "@/components/layout/site-container";
import { getPublishedProjects } from "@/features/projects/server/public-queries";
import { SiteSection } from "@/components/layout/site-section";
import { Slider } from "@/features/projects/components/public-project-slider";

const ProjectIndex = async () => {
  const projects = await getPublishedProjects();
  // return <PublicProjectCards projects={projects} />;
  return <Slider projects={projects} />;
};

export default function ProjectsPage() {
  return (
    <SiteSection className="last:mb-0">
      <SiteContainer className="h-dvh w-full">
        <Suspense
          fallback={
            <p className="py-12 text-base opacity-65">Загрузка проектов….</p>
          }
        >
          <ProjectIndex />
        </Suspense>
      </SiteContainer>
    </SiteSection>
    // <section className="bg-brand-milk text-brand-charcoal min-h-dvh px-5 py-24 md:px-10">
    //   <SiteContainer className="mx-auto max-w-7xl gap-12">
    //     <div>
    //       <p className="text-xs tracking-[0.2em] uppercase opacity-60">
    //         STUDIO POLE / Портфолио
    //       </p>
    //       <h1 className="font-display mt-4 text-5xl md:text-7xl">Проекты</h1>
    //     </div>
    //     <Suspense
    //       fallback={
    //         <p className="py-12 text-base opacity-65">Загрузка проектов…</p>
    //       }
    //     >
    //       <ProjectIndex />
    //     </Suspense>
    //   </SiteContainer>
    // </section>
  );
}
