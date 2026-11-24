import {
  isPriceCode,
  type PriceCode,
} from "@/features/prices/config/price-catalog";
import { getPublishedPrices } from "@/features/prices/server/queries";
import { IndividualServices } from "./individual-services";
import { IndividualProcess } from "./individual-process";
import { IndividualSupport } from "./individual-support";

export async function IndividualSections() {
  const published = await getPublishedPrices();
  const prices = new Map<PriceCode, number>();

  for (const price of published) {
    if (isPriceCode(price.code)) {
      prices.set(price.code, price.amount);
    }
  }

  return (
    <>
      <IndividualServices prices={prices} />
      <IndividualProcess />
      <IndividualSupport prices={prices} />
    </>
  );
}
