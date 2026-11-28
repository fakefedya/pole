
import { Suspense } from "react";
import { IndividualSectionsSkeleton } from "../_components/studio-page-skeletons";

import { IndividualHeroSection } from "./_components/individual-hero";
import { IndividualSections } from "./_components/individual-sections";
import { CTASection } from "@/components/layout/site-cta";

const ctaInformation = {
  title: "Начнём с вашей задачи",
  subtitle:
    "Расскажите о пространстве и планах — поможем выбрать формат работы.",
  buttonText: "Напишите нам",
  ctaBg: "bg-brand-charcoal",
};

export function IndividualDesignPage() {
  return (
    <>
      <IndividualHeroSection />
      <Suspense fallback={<IndividualSectionsSkeleton />}>
        <IndividualSections />
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

export { IndividualDesignPage as default };
