import { CTA } from "@/components/layout/site-cta";
import { HeroSection } from "./_components/hero-section";

export function PricesPage() {
  return (
    <>
      <HeroSection />
      <CTA
        title={"Не уверены, что выбрать?"}
        subtitle={"Расскажите о задаче — поможем определиться с форматом."}
        buttonText={"Связаться с студией"}
        ctaBg="bg-brand-charcoal"
      />
    </>
  );
}

export { PricesPage as default };
