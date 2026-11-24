import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "cn";
import { individualInformation } from "./individual-description";

export function IndividualHeroSection() {
  return (
    <SiteSection>
      <SiteContainer>
        <div className={cn("flex w-full flex-col gap-y-4", "lg:max-w-2/3")}>
          <h1
            className={cn(
              "font-display text-brand-milk text-2xl leading-[1.2] font-semibold whitespace-pre-line uppercase",
              "lg:text-4xl",
              "xl:text-6xl",
            )}
          >
            {individualInformation.hero.title}
          </h1>
          <p className={cn("text-brand-neutral text-xl", "lg:text-2xl")}>
            {individualInformation.hero.description}
          </p>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
