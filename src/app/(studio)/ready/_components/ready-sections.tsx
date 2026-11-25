import { getPublishedPrices } from "@/features/prices/server/queries";

import { readyInformation } from "./ready-description";
import { ReadyCatalogIntro } from "./ready-catalog-intro";
import { ReadyTabs } from "./ready-tabs";

export async function ReadySections() {
  const publishedPrices = await getPublishedPrices();
  const prices = new Map(
    publishedPrices.map(({ code, amount }) => [code, amount]),
  );

  return (
    <ReadyTabs
      interiors={
        <ReadyCatalogIntro
          format={readyInformation.formats.interiors}
          amount={prices.get("ready-interior")}
          titleId="ready-interiors-title"
        />
      }
      capsules={
        <ReadyCatalogIntro
          format={readyInformation.formats.capsules}
          amount={prices.get("shopping-capsule")}
          titleId="ready-capsules-title"
        />
      }
    />
  );
}
