import { Suspense } from "react";
import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, getPriceDefinition } from "@/features/prices/config/price-catalog";
import { getPublishedPrices } from "@/features/prices/server/queries";
import { getPublicImageUrl } from "@/lib/storage/public-image";

import { passportInformation } from "./passport-description";
import { PassportImageDialog } from "./passport-image-dialog";

async function PassportPrice() {
  const { order } = passportInformation;
  const published = await getPublishedPrices();
  const amount = published.find(({ code }) => code === order.priceCode)?.amount;

  return (
    <p>
      {amount === undefined
        ? "Стоимость уточняется"
        : formatPrice(amount, getPriceDefinition(order.priceCode).unit)}
    </p>
  );
}

export function PassportOrder() {
  const { order } = passportInformation;

  return (
    <SiteSection id="passport-order" aria-labelledby="passport-order-title">
      <SiteContainer>
        <div>
          <div>
            <h2 id="passport-order-title">{order.title}</h2>
            <p>{order.lead}</p>
            <ul>
              {order.contents.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p>{order.description}</p>
          </div>
          <div>
            <Suspense fallback={<Skeleton role="status" aria-label="Загружаем стоимость" className="h-10 w-44" />}>
              <PassportPrice />
            </Suspense>
            <p>{order.priceDescription}</p>
            <Link href={order.action.href}>{order.action.label}</Link>
            <aside>
              <h3>{order.sample.title}</h3>
              <p>{order.sample.description}</p>
              <PassportImageDialog
                preview={order.sample.preview}
                imageUrl={getPublicImageUrl(order.sample.preview.image.objectKey)}
              />
            </aside>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
