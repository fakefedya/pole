import { cn } from "@/lib/utils";
import { SiteSection } from "@/components/layout/site-section";
import { SiteContainer } from "@/components/layout/site-container";
import {
  PRICE_CATALOG,
  formatPrice,
  type PriceCode,
} from "@/features/prices/config/price-catalog";
import { getPublishedPrices } from "@/features/prices/server/queries";
import { pricesInformation } from "./prices-description";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SquareText } from "lucide-react";

const byDefinition = new Map(PRICE_CATALOG.map((entry) => [entry.code, entry]));

export async function PricesSections() {
  const prices = await getPublishedPrices();
  const byCode = new Map(prices.map((entry) => [entry.code, entry.amount]));

  return (
    <>
      {pricesInformation.map((section) => (
        <SiteSection id={section.id} key={section.id}>
          <SiteContainer className={cn("z-2 pt-24 pb-5", "lg:pt-32 lg:pb-10")}>
            <div className="grid grid-cols-12 gap-x-8 gap-y-8">
              <div
                className={cn(
                  "col-span-12 flex flex-col gap-y-4",
                  "lg:col-span-6",
                )}
              >
                <h2
                  className={cn(
                    "text-brand-milk font-display text-2xl font-semibold",
                    "lg:text-3xl",
                  )}
                >
                  {section.label}
                </h2>
                <p className="text-brand-neutral text-lg leading-relaxed">
                  {section.description}
                </p>
                {"result" in section && section.result && (
                  <p className="border-brand-terracota-accent text-brand-neutral mt-4 border-l-2 pl-5 text-base">
                    {section.result}
                  </p>
                )}
                {section.link && (
                  <Link
                    href={section.link.href}
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "flex h-12 w-fit items-center gap-2 px-5 text-sm",
                      "bg-brand-terracota-accent text-brand-milk",
                      "hover:bg-brand-terracota transition-colors duration-300",
                    )}
                  >
                    {section.link.label}
                    <section.link.icon size={16} />
                  </Link>
                )}
              </div>
              <div
                className={cn("col-span-12", "lg:col-span-6 lg:col-start-7")}
              >
                {section.rows.length === 0 ? (
                  <div
                    className={cn(
                      "flex flex-col gap-y-8 rounded-lg bg-neutral-900 p-5",
                      "lg:p-10",
                    )}
                  >
                    <p className="text-brand-milk text-xl font-medium">
                      Цена в карточке
                    </p>
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
                        Стоимость зависит от выбранного материала. Превью и
                        состав — в каталоге.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex flex-col gap-y-8 divide-y divide-white/15 rounded-lg bg-neutral-900 p-5",
                      "lg:p-10",
                    )}
                  >
                    {section.rows.map((row) => {
                      const code = row.code as PriceCode;
                      const definition = byDefinition.get(code);

                      if (!definition) return null;
                      const amount = byCode.get(code);

                      return (
                        <div
                          key={code}
                          className={cn(
                            "flex flex-col gap-y-2 pb-8",
                            "last:pb-0",
                          )}
                        >
                          <h3 className="text-brand-milk text-xl font-medium">
                            {"heading" in row && row.heading
                              ? row.heading
                              : definition.title}
                          </h3>
                          <p
                            className={cn(
                              "text-2xl font-semibold",
                              "sm:text-3xl",
                              amount === undefined
                                ? "text-brand-neutral"
                                : "text-orange-500",
                            )}
                          >
                            {amount === undefined
                              ? "Стоимость уточняется"
                              : formatPrice(amount, definition.unit)}
                          </p>
                          {"note" in row && row.note && (
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
                                {row.note}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </SiteContainer>
        </SiteSection>
      ))}
    </>
  );
}
