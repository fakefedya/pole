import {
  formatPrice,
  getPriceDefinition,
  type PriceCode,
} from "@/features/prices/config/price-catalog";
import { cn } from "@/lib/utils";

export type IndividualPriceMap = ReadonlyMap<PriceCode, number>;

type Props = {
  code: PriceCode;
  prices: IndividualPriceMap;
};

export function IndividualPrice({ code, prices }: Props) {
  const amount = prices.get(code);
  const { unit } = getPriceDefinition(code);

  return (
    <p
      className={cn(
        amount === undefined ? "text-brand-muted" : "text-orange-500",
      )}
    >
      {amount === undefined
        ? "Стоимость уточняется"
        : formatPrice(amount, unit)}
    </p>
  );
}
