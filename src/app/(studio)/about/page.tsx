import { CTA } from "@/components/layout/site-cta";
import { ApproachSection } from "./_components/approach-section";
import { HeroSection } from "./_components/hero-section";
import { StatementSection } from "./_components/statement-section";

export function AboutPage() {
  return (
    <>
      <HeroSection />
      <StatementSection />
      <ApproachSection />
      <CTA
        title={"Начнём со знакомства"}
        subtitle={
          "Расскажите о своём пространстве и о том, что хочется изменить. Вместе определим, какой формат работы вам подойдёт."
        }
        buttonText={"Связаться со студией"}
        className="bg-brand-olive-accent"
      />
    </>
  );
}

export { AboutPage as default };
