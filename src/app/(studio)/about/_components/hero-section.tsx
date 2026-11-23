import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { getPublicImageUrl } from "@/lib/storage/public-image";
import { cn } from "@/lib/utils";
import { Certificate, GraduationCap } from "lucide-react";
import Image from "next/image";

const POLINA_IMAGE = getPublicImageUrl("site/about/about/polina-intro.png");

type Description = {
  title: string;
  subtitle: string[];
};

const sectionDescription: Description = {
  title: "Полина Полевая",
  subtitle: [
    "Привет! Я дизайнер интерьера и основатель студии POLE.",
    "Вместе с командой создаём пространства, в которых эстетика и удобство становятся частью повседневной жизни.",
    "Работаем в Санкт-Петербурге и онлайн по России.",
  ],
};

export function HeroSection() {
  return (
    <SiteSection>
      <SiteContainer
        className={cn("z-2 px-5 pt-35 pb-20", "lg:px-10 lg:pt-40")}
      >
        <div className="flex flex-col gap-y-4">
          <div
            className={cn(
              "grid grid-cols-12 gap-x-4 gap-y-8",
              "lg:gap-x-8 lg:gap-y-4",
            )}
          >
            <div
              className={cn(
                "col-span-12 flex flex-col gap-y-4",
                "lg:col-span-6",
              )}
            >
              <h2
                className={cn(
                  "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                  "lg:text-4xl",
                  "xl:text-6xl",
                )}
              >
                {sectionDescription.title}
              </h2>
              {sectionDescription.subtitle.map((el) => (
                <p
                  className={cn("text-brand-neutral text-xl", "lg:text-2xl")}
                  key={el}
                >
                  {el}
                </p>
              ))}
              <div className="mt-8 flex w-full flex-col gap-4">
                <div
                  className={cn(
                    "flex w-full items-center gap-5 rounded-md bg-neutral-900 p-1 py-2 pr-5",
                    "lg:max-w-sm",
                  )}
                >
                  <GraduationCap size={20} className="text-brand-milk ml-4" />
                  <div className="flex flex-col text-sm">
                    <span className="text-brand-milk font-bold">
                      Высшее образование
                    </span>
                    <span className="text-brand-muted">СПбГАСУ</span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex w-full items-center gap-5 rounded-md bg-neutral-900 p-1 py-2 pr-5",
                    "lg:max-w-sm",
                  )}
                >
                  <Certificate size={20} className="text-brand-milk ml-4" />
                  <div className="flex flex-col text-sm">
                    <span className="text-brand-milk font-bold">
                      Курсы повышения квалификации
                    </span>
                    <span className="text-brand-muted">marso.academy</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={cn("col-span-12", "lg:col-span-6 lg:pl-20")}>
              <div
                className={cn(
                  "relative flex aspect-2/3 items-center overflow-hidden rounded-lg",
                  "md:aspect-square",
                  "lg:aspect-square",
                )}
              >
                <div className="absolute inset-0 flex size-full flex-col items-center justify-center overflow-hidden object-cover">
                  <Image
                    src={POLINA_IMAGE}
                    alt="Полина"
                    className="object-cover"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
