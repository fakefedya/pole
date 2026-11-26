import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";

import { materialsInformation } from "./materials-description";
import { cn } from "@/lib/utils";

export function MaterialsHero() {
  const { hero } = materialsInformation;

  return (
    <SiteSection aria-labelledby="materials-page-title">
      <SiteContainer>
        <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
          <h1
            className={cn(
              "font-display text-brand-milk text-2xl leading-[1.2] font-semibold whitespace-pre-line uppercase",
              "lg:text-4xl",
              "xl:text-6xl",
            )}
            id="ready-page-title"
          >
            {hero.titleLines.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </h1>
          <p className={cn("text-brand-neutral text-xl", "lg:text-2xl")}>
            {hero.description}
          </p>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
