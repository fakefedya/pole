import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { getPublicImageUrl } from "@/lib/storage/public-image";
import { BeforeAfterCompare } from "./before-after-compare";

const beforeSrc = getPublicImageUrl("site/home/before-after/before.jpg");
const afterSrc = getPublicImageUrl("site/home/before-after/after.jpg");

export function BeforeAfterSection() {
  return (
    <SiteSection>
      <SiteContainer className="px-10 pt-35 pb-10">
        <div className="flex flex-col gap-8">
          <div className="flex max-w-2/3 flex-col gap-4">
            <h2 className="font-display text-brand-milk text-6xl leading-[1.2] font-semibold uppercase">
              От идеи до реализации
            </h2>
            <p className="text-brand-neutral text-2xl">
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
