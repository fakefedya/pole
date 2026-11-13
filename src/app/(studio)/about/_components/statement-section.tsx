import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { getPublicImageUrl } from "@/lib/storage/public-image";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function StatementSection() {
  return (
    <SiteSection>
      <SiteContainer className={cn("px-5 pt-10 pb-10", "lg:px-10 lg:pt-20")}>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
            <h2
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
              )}
            >
              Хороший дизайн способен изменить повседневную жизнь
            </h2>
          </div>
          <div
            className={cn(
              "bg-brand-espresso relative aspect-4/3 w-full overflow-hidden rounded-lg",
              "sm:aspect-3/2",
              "xl:aspect-4/2",
            )}
          >
            <Image
              src={getPublicImageUrl("site/about/statement/kitchen-itogi.jpg")}
              alt="Изображение интерьера"
              fill
              priority
              sizes="(max-width: 1023px) calc(100vw - 40px), (max-width: 1359px) calc(100vw - 80px), 1280px"
              className="object-cover"
            />
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
