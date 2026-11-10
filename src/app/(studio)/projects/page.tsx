import { Suspense } from "react";

import { ProjectSnapGallery } from "@/features/projects/components/project-snap-gallery";
import { getPublishedProjects } from "@/features/projects/server/public-queries";
import { HidePageScrollbar } from "@/components/layout/hide-page-scrollbar";

async function ProjectIndex() {
  const projects = await getPublishedProjects();
  return <ProjectSnapGallery projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div
          className="bg-brand-black min-h-dvh w-full"
          aria-label="Загрузка проектов"
        />
      }
    >
      <HidePageScrollbar />
      <ProjectIndex />
    </Suspense>
  );
}
