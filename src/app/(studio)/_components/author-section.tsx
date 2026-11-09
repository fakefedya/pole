import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { buttonVariants } from "@/components/ui/button";
import { getPublicImageUrl } from "@/lib/storage/public-image";
import { cn } from "@/lib/utils";
import { Certificate, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AuthorSection() {
  return (
    <SiteSection>
      <SiteContainer className="px-10 py-35">
        <div className="flex flex-col gap-8">
          <div className="flex max-w-2/3 flex-col gap-2">
            <h2 className="font-display text-brand-milk text-6xl leading-[1.2] font-semibold uppercase">
              Продуманность в каждой детали
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-x-4 gap-y-8 md:gap-y-16">
            <div className="relative col-span-12 flex aspect-3/2 h-auto w-full items-stretch gap-x-1 overflow-hidden rounded-md md:col-span-4 lg:col-span-6">
              <div className="relative flex size-full items-center overflow-hidden rounded-md">
                <div className="absolute inset-0 flex size-full flex-col items-center justify-center overflow-hidden object-cover">
                  <Image
                    src={getPublicImageUrl(
                      "site/home/author/polina-working.png",
                    )}
                    alt="Полина"
                    className="object-cover"
                    fill
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 flex h-full flex-col gap-4 md:col-span-8 md:pl-14 lg:col-span-6">
              <p className="text-brand-neutral text-2xl">
                Соединяю архитектурный подход с вниманием к повседневной жизни:
                как вы двигаетесь по дому, где храните вещи и какой свет нужен
                вечером.
              </p>
              <div className="flex flex-col gap-1">
                <p className="font-base text-brand-milk text-xl">
                  Полина Полевая, основатель студии POLE
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-8">
                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full max-w-sm items-center gap-5 rounded-md bg-neutral-900 p-1 py-2 pr-5">
                    <GraduationCap size={20} className="text-brand-milk ml-4" />
                    <div className="flex flex-col text-sm">
                      <span className="text-brand-milk font-bold">
                        Высшее образование
                      </span>
                      <span className="text-brand-muted">СПбГАСУ</span>
                    </div>
                  </div>
                  <div className="flex w-full max-w-sm items-center gap-5 rounded-md bg-neutral-900 p-1 py-2 pr-5">
                    <Certificate size={20} className="text-brand-milk ml-4" />
                    <div className="flex flex-col text-sm">
                      <span className="text-brand-milk font-bold">
                        Курсы повышения квалификации
                      </span>
                      <span className="text-brand-muted">marso.academy</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/about"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "h-12 w-fit px-5 text-sm",
                    "bg-brand-terracota-accent text-brand-milk",
                    "hover:bg-brand-terracota transition-colors duration-300",
                  )}
                >
                  О подходе студии
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
