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
      <SiteContainer className="px-10 pt-70 pb-35">
        <div className="flex flex-col gap-8">
          <div className="flex max-w-2/3 flex-col gap-4">
            <h2 className="font-display text-brand-milk text-6xl leading-[1.2] font-semibold uppercase">
              {sectionDescription.title}
            </h2>
            <p className="text-brand-neutral text-2xl">
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
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
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
