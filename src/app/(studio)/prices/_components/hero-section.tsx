import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pricesInformation } from "./prices-description";

export function HeroSection() {
  return (
    <SiteSection>
      <SiteContainer
        className={cn("z-2 px-5 pt-35 pb-20", "lg:px-10 lg:pt-40")}
      >
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
            <h1
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
                "xl:text-6xl",
              )}
            >
              Ваш интерьер.
              <br />
              Ваш формат.
            </h1>
            <p className={cn("text-brand-neutral text-xl", "lg:text-2xl")}>
              Индивидуальный проект, готовое решение или помощь с выбором.{" "}
              Сравните состав и стоимость — и выберите то, что нужно вам.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pricesInformation.map((el) => {
              const anchorLink = `#${el.id}`;

              return (
                <Button
                  key={el.label}
                  className={cn(
                    "border-brand-milk/50 h-12 w-fit cursor-pointer border px-5 text-sm",
                    "hover:border-brand-terracota-accent transition-colors duration-300",
                  )}
                  render={<a href={anchorLink}>{el.label}</a>}
                  nativeButton={false}
                />
              );
            })}
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
