import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";

export function ContactsHeroSection() {
  return (
    <SiteSection>
      <SiteContainer>
        <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
          <h1
            className={cn(
              "font-display text-brand-milk text-3xl leading-[1.15] font-semibold uppercase",
              "sm:text-4xl",
              "lg:text-5xl",
              "xl:text-6xl",
            )}
          >
            Будем на связи
          </h1>
          <p
            className={cn(
              "text-brand-neutral max-w-2xl text-base leading-relaxed",
              "sm:text-xl",
              "lg:text-2xl",
            )}
          >
            О вашем интерьере, выборе подходящей услуги или вопросах по покупке
            — напишите нам.
          </p>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
