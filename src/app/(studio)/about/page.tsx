import { ApproachSection } from "./_components/approach-section";
import { HeroSection } from "./_components/hero-section";
import { StatementSection } from "./_components/statement-section";

export function AboutPage() {
  return (
    <>
      <HeroSection />
      <StatementSection />
      <ApproachSection />
    </>
  );
}

export { AboutPage as default };
