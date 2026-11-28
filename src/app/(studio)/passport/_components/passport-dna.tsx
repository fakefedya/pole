import Image from "next/image";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { getPublicImageUrl } from "@/lib/storage/public-image";

import { passportInformation } from "./passport-description";
import { cn } from "@/lib/utils";

export function PassportDna() {
  const { dna } = passportInformation;

  return (
    <SiteSection aria-labelledby="passport-dna-title">
      <SiteContainer>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex w-full flex-col gap-y-4", "lg:max-w-2/3")}>
            <h2
              id="passport-dna-title"
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
              )}
            >
              {dna.title}
            </h2>
            <p className="text-brand-neutral text-lg leading-relaxed">
              {dna.description}
            </p>
          </div>

          <div className={cn("grid grid-cols-12 gap-x-4 gap-y-16")}>
            {dna.items.map((item) => (
              <article
                key={item.title}
                className={cn("col-span-12", "lg:col-span-3")}
              >
                <div className="flex h-full flex-col gap-y-8 rounded-lg bg-[#eae4df]">
                  <div className="relative m-2 aspect-square items-center overflow-hidden rounded-md">
                    <div className="absolute inset-0 flex size-full items-center justify-center overflow-hidden">
                      <Image
                        src={getPublicImageUrl(item.image.objectKey)}
                        alt={item.image.alt}
                        fill
                        className="h-auto max-w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4 px-5 pt-0 pb-5">
                    <h3 className="text-brand-charcoal font-display text-xl font-medium">
                      {item.title}
                    </h3>
                    <p className="text-brand-charcoal text-sm lg:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
