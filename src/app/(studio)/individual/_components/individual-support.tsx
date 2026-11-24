import { getPriceDefinition } from "@/features/prices/config/price-catalog";
import { individualInformation } from "./individual-description";
import { IndividualPrice, type IndividualPriceMap } from "./individual-price";
import { SiteSection } from "@/components/layout/site-section";
import { SiteContainer } from "@/components/layout/site-container";
import { cn } from "@/lib/utils";
import { SquareText } from "lucide-react";

type Props = {
  prices: IndividualPriceMap;
};

export function IndividualSupport({ prices }: Props) {
  const { support } = individualInformation;

  return (
    <SiteSection id="support" aria-labelledby="individual-support-title">
      <SiteContainer>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex w-full flex-col gap-y-4", "lg:max-w-2/3")}>
            <h2
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
              )}
              id="individual-support-title"
            >
              {support.title}
            </h2>
            <p className="text-brand-neutral text-lg leading-relaxed">
              {support.description}
            </p>
          </div>
          <div>
            <div className="grid grid-cols-12 gap-4">
              {support.services.map((service) => (
                <article
                  className={cn(
                    "col-span-12 flex flex-col gap-y-4 rounded-lg bg-neutral-900 p-5",
                    "lg:col-span-6 lg:p-10",
                  )}
                  key={service.code}
                >
                  <h3
                    className={cn(
                      "text-brand-milk font-display text-2xl font-semibold",
                      "lg:text-3xl",
                    )}
                  >
                    {getPriceDefinition(service.code).title}
                  </h3>
                  <div className={cn("text-2xl font-semibold", "sm:text-3xl")}>
                    <IndividualPrice code={service.code} prices={prices} />
                  </div>
                  {service.paragraphs.map((paragraph) => (
                    <p
                      className="text-brand-neutral text-lg leading-relaxed"
                      key={paragraph}
                    >
                      {paragraph}
                    </p>
                  ))}
                  <div className="mt-4 flex items-center gap-5 rounded-md bg-neutral-800 p-1 py-4 pr-5">
                    <SquareText
                      size={24}
                      strokeWidth={1.4}
                      className="text-brand-neutral ml-4 shrink-0"
                    />
                    <p
                      className={cn(
                        "text-brand-neutral text-sm",
                        "lg:text-base",
                      )}
                    >
                      {service.note}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
