
import { Suspense } from "react";
import { ReadySectionsSkeleton } from "../_components/studio-page-skeletons";

import { ReadyHero } from "./_components/ready-hero";
import { ReadySections } from "./_components/ready-sections";

export function ReadySolutionsPage() {
  return (
    <>
      <ReadyHero />
      <Suspense fallback={<ReadySectionsSkeleton />}>
        <ReadySections />
      </Suspense>
    </>
  );
}

export { ReadySolutionsPage as default };
