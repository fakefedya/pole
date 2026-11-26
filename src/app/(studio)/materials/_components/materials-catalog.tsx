import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";

import { MaterialsCard } from "./materials-card";
import { materialsInformation } from "./materials-description";
import { cn } from "@/lib/utils";

export function MaterialsCatalog() {
  const { catalog } = materialsInformation;

  return (
    <SiteSection aria-labelledby="materials-catalog-title">
      <SiteContainer className={cn("pt-5", "lg:pt-10")}>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex w-full flex-col gap-y-4", "lg:max-w-2/3")}>
            <h2
              className={cn(
                "text-brand-milk font-display text-2xl font-semibold",
                "lg:text-3xl",
              )}
              id="individual-process-title"
            >
              {catalog.title}
            </h2>
          </div>
          <div className={cn("grid grid-cols-12 gap-x-4 gap-y-8")}>
            {catalog.items.map((material) => (
              <MaterialsCard key={material.id} material={material} />
            ))}
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
