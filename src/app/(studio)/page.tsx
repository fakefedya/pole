import { Suspense } from "react";
import { AboutSection } from "./_components/about-section";
import { HeroSection } from "./_components/hero/hero-section";
import { SolutionsSection } from "./_components/solutions/solutions-section";
import { FeaturedProjectsSection } from "./_components/featured-projects/featured-projects-section";
import { BeforeAfterSection } from "./_components/before-after/before-after-section";
import { AuthorSection } from "./_components/author-section";
import { CTA } from "@/components/layout/site-cta";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Suspense
        fallback={
          <section className="min-h-80" aria-label="Загрузка проектов" />
        }
      >
        <FeaturedProjectsSection />
      </Suspense>
      <SolutionsSection />
      <BeforeAfterSection />
      <AuthorSection />

      <CTA
        title={"Начнём со знакомства"}
        subtitle={
          "Расскажите о своём пространстве и о том, что хочется изменить. Вместе определим, какой формат работы вам подойдёт."
        }
        buttonText={"Связаться со студией"}
        ctaBg="bg-brand-espresso"
      />
    </>
  );
}
export { HomePage as default };
