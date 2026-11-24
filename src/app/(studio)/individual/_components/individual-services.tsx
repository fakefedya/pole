import Link from "next/link";

import { getPriceDefinition } from "@/features/prices/config/price-catalog";
import { individualInformation } from "./individual-description";
import { IndividualPrice, type IndividualPriceMap } from "./individual-price";
import { SiteSection } from "@/components/layout/site-section";
import { SiteContainer } from "@/components/layout/site-container";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight, Send } from "lucide-react";
import { IndividualDrawingsAccordion } from "./individual-drawings-accordion";

type Props = {
  prices: IndividualPriceMap;
};

export function IndividualServices({ prices }: Props) {
  return (
    <SiteSection aria-label="Индивидуальные услуги">
      <SiteContainer>
        <div
          className={cn("grid grid-cols-12 gap-4 rounded-lg bg-neutral-900")}
        >
          {individualInformation.services.map((service) => (
            <article
              className={cn(
                "col-span-12 p-5",
                "lg:col-span-6",
                "odd:border-brand-milk/15 odd:border-r odd:pr-10",
                "even:pl-6",
                "lg:p-10",
              )}
              id={service.id}
              key={service.code}
            >
              <div className={cn("flex flex-col gap-y-8")}>
                <header className="border-brand-milk/15 flex flex-col gap-y-4 border-b pb-8">
                  <h2
                    className={cn(
                      "text-brand-milk font-display text-2xl font-semibold",
                      "lg:text-3xl",
                    )}
                  >
                    {getPriceDefinition(service.code).title}
                  </h2>
                  <p className="text-brand-neutral min-h-22 text-lg leading-relaxed">
                    {service.description}
                  </p>
                  <div className={cn("text-2xl font-semibold", "sm:text-3xl")}>
                    <IndividualPrice code={service.code} prices={prices} />
                  </div>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "flex h-12 w-fit items-center gap-2 px-5 text-sm",
                      "bg-brand-terracota-accent text-brand-milk",
                      "hover:bg-brand-terracota transition-colors duration-300",
                    )}
                    href={service.action.href}
                  >
                    {service.action.label}
                    <Send size={16} />
                  </Link>
                </header>

                <div className="flex flex-col gap-y-8">
                  <h3 className="text-brand-milk text-xl font-medium">
                    {service.contentsTitle}
                  </h3>

                  <ul className="flex flex-col gap-y-4">
                    {service.contents.map((item) => (
                      <li
                        className={cn(
                          "text-brand-neutral relative pl-4 text-base",
                          "before:bg-brand-terracota-accent before:absolute before:top-1/2 before:left-0 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                          "lg:text-ls",
                        )}
                        key={item}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {service.drawings && (
                    <IndividualDrawingsAccordion
                      title={service.drawings.title}
                      items={service.drawings.items}
                    />
                  )}

                  {service.album && (
                    <aside className="border-brand-terracota-accent bg-brand-terracota/30 flex flex-col gap-y-4 rounded-lg border p-5">
                      <h3
                        className={cn(
                          "text-brand-milk font-display text-xl font-semibold",
                          "lg:text-2xl",
                        )}
                      >
                        {service.album.title}
                      </h3>
                      <p className="text-brand-neutral text-lg leading-relaxed">
                        {service.album.description}
                      </p>
                      {service.album.action && (
                        <Link
                          className={cn(
                            buttonVariants({ variant: "default", size: "lg" }),
                            "flex h-12 items-center gap-2 px-5 text-sm",
                            "bg-brand-terracota-accent text-brand-milk",
                            "hover:bg-brand-terracota transition-colors duration-300",
                          )}
                          href={service.album.action.href}
                        >
                          {service.album.action.label}
                          <ArrowUpRight size={16} />
                        </Link>
                      )}
                    </aside>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
