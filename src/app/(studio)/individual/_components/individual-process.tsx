import Image from "next/image";

import { individualInformation } from "./individual-description";
import { SiteSection } from "@/components/layout/site-section";
import { SiteContainer } from "@/components/layout/site-container";
import { cn } from "@/lib/utils";
import { getPublicImageUrl } from "@/lib/storage/public-image";

export function IndividualProcess() {
  const { process } = individualInformation;

  return (
    <SiteSection aria-labelledby="individual-process-title">
      <SiteContainer>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex w-full flex-col gap-y-4", "lg:max-w-2/3")}>
            <h2
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
              )}
              id="individual-process-title"
            >
              {process.title}
            </h2>
            <p className="text-brand-neutral text-lg leading-relaxed">
              {process.description}
            </p>
          </div>

          <ol className={cn("grid grid-cols-12 gap-x-4 gap-y-16")}>
            {process.steps.map((step) => (
              <li
                className={cn("col-span-12", "lg:col-span-6", "xl:col-span-3")}
                key={step.number}
              >
                <div
                  className={cn(
                    "flex h-full gap-x-4",
                    "lg:flex-col lg:gap-y-8",
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-col items-center",
                      'after:bg-brand-terracota after:mt-4 after:w-px after:flex-1 after:content-[""]',
                      "lg:flex-row lg:after:mt-0 lg:after:ml-4 lg:after:h-px",
                    )}
                  >
                    <span
                      className={cn(
                        "font-display text-brand-terracota-accent text-2xl leading-[1.2] font-semibold",
                        "lg:text-4xl",
                      )}
                    >
                      {step.number}
                    </span>
                  </div>
                  <div className="flex h-full flex-col gap-y-8 rounded-lg bg-neutral-900">
                    {step.image && (
                      <div className="relative m-2 aspect-square items-center overflow-hidden rounded-md">
                        <div className="absolute inset-0 flex size-full items-center justify-center overflow-hidden">
                          <Image
                            src={getPublicImageUrl(step.image.src)}
                            alt={step.image.alt}
                            className="object-cover"
                            fill
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-y-4 px-5 pt-0 pb-5">
                      <h3 className="text-brand-milk text-xl font-medium">
                        {step.title}
                      </h3>
                      <p className="text-brand-neutral text-sm lg:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
