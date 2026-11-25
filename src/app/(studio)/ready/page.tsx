import { Suspense } from "react";

import { ReadyHero } from "./_components/ready-hero";
import { ReadySections } from "./_components/ready-sections";

export function ReadySolutionsPage() {
  return (
    <>
      <ReadyHero />
      <Suspense fallback={<section aria-label="Загрузка готовых решений" />}>
        <ReadySections />
      </Suspense>
    </>
  );
}

export { ReadySolutionsPage as default };
