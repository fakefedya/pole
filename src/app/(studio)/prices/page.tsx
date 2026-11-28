import { Suspense } from "react";
import { PricesSectionsSkeleton } from "../_components/studio-page-skeletons";
import { PricesSections } from "./_components/prices-sections";
import { CTASection } from "@/components/layout/site-cta";
import { HeroSection } from "./_components/hero-section";

const ctaInformation = {
  title: "Не уверены, что выбрать?",
  subtitle: "Поможем определиться с услугой под ваши задачи и бюджет.",
  buttonText: "Подобрать формат",
  ctaBg: "bg-brand-charcoal",
};

export function PricesPage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<PricesSectionsSkeleton />}>
        <PricesSections />
      </Suspense>

      <CTASection
        title={ctaInformation.title}
        subtitle={ctaInformation.subtitle}
        buttonText={ctaInformation.buttonText}
        ctaBg={ctaInformation.ctaBg}
      />
    </>
  );
}

export { PricesPage as default };
