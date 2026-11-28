
import { Suspense } from "react";
import { FeaturedProjectsSkeleton } from "./_components/studio-page-skeletons";
import { AboutSection } from "./_components/about-section";
import { HeroSection } from "./_components/hero/hero-section";
import { SolutionsSection } from "./_components/solutions/solutions-section";
import { FeaturedProjectsSection } from "./_components/featured-projects/featured-projects-section";
import { BeforeAfterSection } from "./_components/before-after/before-after-section";
import { AuthorSection } from "./_components/author-section";
import { CTASection } from "@/components/layout/site-cta";

const ctaInformation = {
  title: "Начнём с вашего дома",
  subtitle:
    "Расскажите, что хотите изменить, — поможем выбрать подходящий формат.",
  buttonText: "Обсудить задачу",
  ctaBg: "bg-brand-cacao",
};

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Suspense
        fallback={
          <FeaturedProjectsSkeleton />
        }
      >
        <FeaturedProjectsSection />
      </Suspense>
      <SolutionsSection />
      <BeforeAfterSection />
      <AuthorSection />

      <CTASection
        title={ctaInformation.title}
        subtitle={ctaInformation.subtitle}
        buttonText={ctaInformation.buttonText}
        ctaBg={ctaInformation.ctaBg}
      />
    </>
  );
}
export { HomePage as default };
