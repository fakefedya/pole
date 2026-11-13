import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";

export function AboutPage() {
  <SiteSection>
    <SiteContainer className={cn("px-5 pt-35 pb-35", "lg:px-10 lg:pt-70")}>
      <div className={cn("grid grid-cols-12 gap-x-4", "lg:gap-x-8")}>
        <div className={cn("col-span-12", "lg:col-span-6")}></div>
        <div className={cn("col-span-12", "lg:col-span-6")}>
          <div className="">{/* Изображение */}</div>
        </div>
      </div>
    </SiteContainer>
  </SiteSection>;
}
