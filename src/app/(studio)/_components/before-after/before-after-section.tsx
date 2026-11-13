import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { getPublicImageUrl } from "@/lib/storage/public-image";
import { BeforeAfterCompare } from "./before-after-compare";
import { cn } from "cn";

const beforeSrc = getPublicImageUrl("site/home/before-after/before.jpg");
const afterSrc = getPublicImageUrl("site/home/before-after/after.jpg");

export function BeforeAfterSection() {
  return (
    <SiteSection>
      <SiteContainer className={cn("px-5 pt-35 pb-5", "pb-10 lg:px-10")}>
        <div className="flex flex-col gap-8">
          <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
            <h2
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
                "xl:text-6xl",
              )}
            >
              От идеи до реализации
            </h2>
            <p className={cn("text-brand-neutral text-xl", "lg:text-2xl")}>
              Создание стильного интерьера — это сложный и многоэтапный процесс,
              который требует профессионального подхода.
            </p>
          </div>

          <BeforeAfterCompare beforeSrc={beforeSrc} afterSrc={afterSrc} />
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
