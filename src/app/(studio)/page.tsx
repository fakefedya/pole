import { Suspense } from "react";
import { AboutSection } from "./_components/about-section";
import { HeroSection } from "./_components/hero/hero-section";
import { SolutionsSection } from "./_components/solutions/solutions-section";
import { FeaturedProjectsSection } from "./_components/featured-projects/featured-projects-section";
import { BeforeAfterSection } from "./_components/before-after/before-after-section";
import { AuthorSection } from "./_components/author-section";

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
    </>
  );
}
export { HomePage as default };
