import Image from "next/image";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { getPublicImageUrl } from "@/lib/storage/public-image";

import { passportInformation } from "./passport-description";
import { cn } from "@/lib/utils";
import { Heart, MoveRight } from "lucide-react";

export function PassportCaseStudy() {
  const { caseStudy } = passportInformation;

  return (
    <SiteSection aria-labelledby="passport-case-title">
      <SiteContainer>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex w-full flex-col gap-y-4", "lg:max-w-2/3")}>
            <h2
              id="passport-case-title"
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
              )}
            >
              {caseStudy.title}
            </h2>
            <p className="text-brand-neutral text-lg leading-relaxed">
              {caseStudy.description}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-y-8">
            <div className="col-span-7 flex flex-col gap-y-4">
              <h3 className="text-brand-milk font-display text-xl font-medium">
                {caseStudy.referencesTitle}
              </h3>
              <div className="grid grid-cols-12 gap-x-4 gap-y-8">
                {caseStudy.references.map((reference) => (
                  <figure
                    key={reference.image.objectKey}
                    className="col-span-4 rounded-lg bg-neutral-900"
                  >
                    <div className="i relative m-2 aspect-3/4 items-center overflow-hidden rounded-md">
                      <div className="absolute inset-0 flex size-full items-center justify-center overflow-hidden">
                        <Image
                          src={getPublicImageUrl(reference.image.objectKey)}
                          alt={reference.image.alt}
                          fill
                          className="h-auto max-w-full"
                        />
                      </div>
                    </div>

                    <figcaption className="flex flex-col gap-y-4 p-5">
                      <strong className="text-brand-milk font-display text-lg font-medium">
                        {reference.title}
                      </strong>
                      <p className="text-brand-neutral text-xs lg:text-sm">
                        {reference.description}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="text-brand-milk bg-brand-terracota/30 mt-4 flex items-center gap-5 rounded-lg p-1 py-4 pr-5">
                <Heart size={20} className="ml-4 shrink-0" />
                <p className="text-base">{caseStudy.conclusion}</p>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="text-brand-terracota col-span-1 flex flex-col items-center justify-center"
            >
              <MoveRight size={32} />
            </div>

            <div className="col-span-4 flex flex-col gap-y-4">
              <h3 className="text-brand-milk font-display text-xl font-medium">
                {caseStudy.resultTitle}
              </h3>
              <figure className="col-span-4 rounded-lg bg-neutral-900">
                <div className="relative m-2 aspect-3/4 items-center overflow-hidden rounded-md">
                  <div className="absolute inset-0 flex size-full items-center justify-center overflow-hidden">
                    <Image
                      src={getPublicImageUrl(caseStudy.result.image.objectKey)}
                      alt={caseStudy.result.image.alt}
                      fill
                      className="h-auto max-w-full"
                    />
                  </div>
                </div>
                <figcaption className="flex flex-col gap-y-4 p-5">
                  <strong className="text-brand-milk font-display text-lg">
                    {caseStudy.result.title}
                  </strong>
                  <p className="text-brand-neutral text-sm lg:text-base">
                    {caseStudy.result.description}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
