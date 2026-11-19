import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";

export function ContactsHeroSection() {
  return (
    <SiteSection>
      <SiteContainer className={cn("relative z-2 px-5 pt-28 pb-10", "sm:px-8 sm:pt-32 sm:pb-14", "lg:px-10 lg:pt-40 lg:pb-20")}>
        <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
          <h1 className={cn(
            "font-display text-3xl leading-[1.15] font-semibold uppercase text-brand-milk",
            "sm:text-4xl", "lg:text-5xl", "xl:text-6xl",
          )}>
            Будем на связи
          </h1>
          <p className={cn("max-w-2xl text-base leading-relaxed text-brand-neutral", "sm:text-xl", "lg:text-2xl")}>
            О вашем интерьере, выборе подходящей услуги или вопросах по покупке — напишите нам.
          </p>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
