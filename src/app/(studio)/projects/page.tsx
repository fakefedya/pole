
import { Suspense } from "react";
import { ProjectsIndexSkeleton } from "../_components/studio-page-skeletons";

import { ProjectSnapGallery } from "@/features/projects/components/project-snap-gallery";
import { getPublishedProjects } from "@/features/projects/server/public-queries";
import { HidePageScrollbar } from "@/components/layout/hide-page-scrollbar";

async function ProjectIndex() {
  const projects = await getPublishedProjects();
  return <ProjectSnapGallery projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <>
      <HidePageScrollbar />
      <Suspense fallback={<ProjectsIndexSkeleton />}>
        <ProjectIndex />
      </Suspense>
    </>
  );
}
