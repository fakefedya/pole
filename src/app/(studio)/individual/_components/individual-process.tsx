import Image from "next/image";

import { individualInformation } from "./individual-description";
import { SiteSection } from "@/components/layout/site-section";
import { SiteContainer } from "@/components/layout/site-container";
import { cn } from "@/lib/utils";

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

          <ol className={cn("grid grid-cols-1 gap-4", "lg:grid-cols-12")}>
            {process.steps.map((step) => (
              <li
                className={cn("col-span-12", "lg:col-span-3")}
                key={step.number}
              >
                <div className="flex h-full flex-col gap-y-8">
                  <div
                    className={cn(
                      "flex items-center",
                      'after:ml-4 after:h-px after:flex-1 after:bg-[#d79a7266] after:content-[""]',
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
                  <div className="flex h-full flex-col gap-y-8 rounded-lg bg-neutral-900 p-5">
                    {step.image && (
                      <a
                        href={step.image.src}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={step.image.src}
                          alt={step.image.alt}
                          width={step.image.width}
                          height={step.image.height}
                        />
                      </a>
                    )}
                    <h3 className="text-brand-milk text-xl font-medium">
                      {step.title}
                    </h3>
                    <p className="text-brand-neutral text-sm lg:text-base">
                      {step.description}
                    </p>
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
