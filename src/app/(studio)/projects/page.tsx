import { Suspense } from "react";
import { SiteContainer } from "@/components/layout/site-container";
import { PublicProjectCards } from "@/features/projects/components/public-project-cards";
import { getPublishedProjects } from "@/features/projects/server/public-queries";

async function ProjectIndex() {
  const projects = await getPublishedProjects();
  return <PublicProjectCards projects={projects} />;
}
export default function ProjectsPage() {
  return (
    <section className="bg-brand-milk text-brand-charcoal min-h-dvh px-5 py-24 md:px-10">
      <SiteContainer className="mx-auto max-w-7xl gap-12">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase opacity-60">
            STUDIO POLE / Портфолио
          </p>
          <h1 className="font-display mt-4 text-5xl md:text-7xl">Проекты</h1>
        </div>
        <Suspense
          fallback={
            <p className="py-12 text-base opacity-65">Загрузка проектов…</p>
          }
        >
          <ProjectIndex />
        </Suspense>
      </SiteContainer>
    </section>
  );
}
