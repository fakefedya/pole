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

const byDefinition = new Map(PRICE_CATALOG.map((entry) => [entry.code, entry]));

export async function PricesSections() {
  const prices = await getPublishedPrices();
  const byCode = new Map(prices.map((entry) => [entry.code, entry.amount]));

  return (
    <>
      {pricesInformation.map((section) => (
        <SiteSection id={section.id} key={section.id} className="scroll-mt-8">
          <SiteContainer
            className={cn(
              "grid grid-cols-1 gap-8 px-5 py-12",
              "lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20",
            )}
          >
            <div className="max-w-2xl space-y-5">
              <h2
                className={cn(
                  "font-display text-brand-milk text-2xl leading-tight font-semibold uppercase",
                  "md:text-3xl xl:text-4xl",
                )}
              >
                {section.label}
              </h2>
              <p className="text-brand-neutral text-lg leading-relaxed">
                {section.description}
              </p>
              {"result" in section && section.result && (
                <p className="border-brand-terracota-accent text-brand-neutral border-l-2 pl-5 text-base leading-relaxed">
                  {section.result}
                </p>
              )}
            </div>
            <div className="min-w-0 self-start rounded-3xl border border-white/10 bg-[#191a1a] p-6 md:p-8">
              {section.rows.length === 0 ? (
                <>
                  <p className="text-brand-milk text-xl font-medium">
                    Цена в карточке
                  </p>
                  <p className="text-brand-neutral mt-3 text-base leading-relaxed">
                    Стоимость зависит от выбранного материала. Превью и состав —
                    в каталоге.
                  </p>
                </>
              ) : (
                <div className="divide-y divide-white/15">
                  {section.rows.map((row) => {
                    const code = row.code as PriceCode;
                    const definition = byDefinition.get(code);
                    if (!definition) return null;
                    const amount = byCode.get(code);
                    return (
                      <div key={code} className="py-5 first:pt-0 last:pb-0">
                        <h3 className="text-brand-milk text-lg font-medium">
                          {"heading" in row && row.heading
                            ? row.heading
                            : definition.title}
                        </h3>
                        <p
                          className={cn(
                            "mt-3 text-2xl leading-tight font-semibold",
                            "sm:text-3xl",
                            amount === undefined
                              ? "text-brand-neutral"
                              : "text-[#ff9b50]",
                          )}
                        >
                          {amount === undefined
                            ? "Стоимость уточняется"
                            : formatPrice(amount, definition.unit)}
                        </p>
                        {"note" in row && row.note && (
                          <p className="text-brand-neutral mt-3 text-sm leading-relaxed">
                            {row.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SiteContainer>
        </SiteSection>
      ))}
    </>
  );
}
