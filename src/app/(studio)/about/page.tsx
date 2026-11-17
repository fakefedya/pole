import { CTASection } from "@/components/layout/site-cta";
import { ApproachSection } from "./_components/approach-section";
import { HeroSection } from "./_components/hero-section";
import { StatementSection } from "./_components/statement-section";

const ctaInformation = {
  title: "Давайте познакомимся",
  subtitle: "Расскажите о вашем пространстве и ожиданиях от работы с нами.",
  buttonText: "Написать нам",
  ctaBg: "bg-brand-olive-accent",
};

export function AboutPage() {
  return (
    <>
      <HeroSection />
      <StatementSection />
      <ApproachSection />
      <CTASection
        title={ctaInformation.title}
        subtitle={ctaInformation.subtitle}
        buttonText={ctaInformation.buttonText}
        ctaBg={ctaInformation.ctaBg}
      />
    </>
  );
}

export { AboutPage as default };
