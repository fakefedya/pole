import Image from "next/image";
import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { getPublicImageUrl } from "@/lib/storage/public-image";

import { passportInformation } from "./passport-description";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export function PassportHero() {
  const { hero } = passportInformation;

  return (
    <SiteSection aria-labelledby="passport-page-title">
      <SiteContainer>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
            <h1
              id="passport-page-title"
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
                "xl:text-6xl",
              )}
            >
              {hero.title}
            </h1>
            <p className={cn("text-brand-neutral text-xl", "lg:text-2xl")}>
              {hero.description}
            </p>
            <div className="flex items-center gap-x-2">
              <Link
                href={hero.orderAction.href}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "flex h-12 w-fit items-center gap-2 px-5 text-sm",
                  "bg-brand-terracota-accent text-brand-milk",
                  "hover:bg-brand-terracota transition-colors duration-300",
                )}
              >
                {hero.orderAction.label}
                <ArrowDown size={16} />
              </Link>

              <Link
                href={hero.orderAction.href}
                className={cn(
                  "text-brand-milk border-brand-terracota-accent flex h-12 w-fit cursor-pointer items-center gap-2 rounded-full border px-5 text-sm",
                  "hover:border-brand-terracota hover:text-brand-milk/80 transition-colors duration-300",
                )}
              >
                {hero.preview.label}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div
            className={cn(
              "relative flex aspect-square items-center overflow-hidden rounded-lg bg-[#eae4df] p-5",
              "lg:aspect-video lg:p-10",
            )}
          >
            <div className="absolute inset-0 flex size-full flex-col items-center justify-center overflow-hidden">
              <Image
                src={getPublicImageUrl(hero.image.objectKey)}
                alt={hero.image.alt}
                priority
                className="object-contain"
                fill
              />
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
