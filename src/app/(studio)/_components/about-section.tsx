import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { Button } from "@/components/ui/button";
import { getPublicImageUrl } from "@/lib/storage/public-image";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Description = {
  title: string;
  subtitle: string;
  description: string;
};

const sectionDescription: Description = {
  title: "Авторская студия дизайна интерьера",
  subtitle: "Работаем в Санкт-Петербурге и онлайн по России.",
  description:
    "Разрабатываем индивидуальные проекты, предлагаем готовые решения и создаём понятные инструменты для самостоятельной работы с интерьером.",
};

const SignboardSrc = getPublicImageUrl("site/home/about/pole-signboard.png");

export function AboutSection() {
  return (
    <SiteSection>
      <SiteContainer className={cn("px-5 pt-35 pb-35", "lg:px-10 lg:pt-70")}>
        <div className="flex flex-col gap-8">
          <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
            <h2
              className={cn(
                "font-display text-brand-milk text-3xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
                "xl:text-6xl",
              )}
            >
              {sectionDescription.title}
            </h2>
            <p className={cn("text-brand-neutral text-xl", "lg:text-2xl")}>
              {sectionDescription.subtitle}
            </p>
          </div>
          <div className="item-center flex gap-2">
            <Button
              className={cn(
                "bg-brand-terracota-accent h-12 w-fit cursor-pointer px-5 text-sm",
                "hover:bg-brand-terracota transition-colors duration-300",
              )}
              render={<a href={"#solutions"}>Выбрать направление</a>}
              nativeButton={false}
            />
            <Button
              className={cn(
                "bg-brand-terracota-accent h-12 w-fit cursor-pointer px-5 text-sm",
                "hover:bg-brand-terracota transition-colors duration-300",
              )}
              render={<a href={"#featured-projects"}>Последние проекты</a>}
              nativeButton={false}
            />
          </div>
          <div
            className={cn(
              "relative aspect-2/3 w-full overflow-hidden rounded-lg",
              "lg:aspect-video",
            )}
          >
            <Image
              src={SignboardSrc}
              alt="Надпись POLE"
              className="object-cover"
              fill
            />
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
