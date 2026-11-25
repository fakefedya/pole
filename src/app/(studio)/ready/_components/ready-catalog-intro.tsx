import Image from "next/image";

import {
  formatPrice,
  getPriceDefinition,
} from "@/features/prices/config/price-catalog";

import { readyInformation } from "./ready-description";
import { ReadyComingSoon } from "./ready-coming-soon";
import { cn } from "@/lib/utils";
import { SquareExclamationPoint, SquareText } from "lucide-react";
import { getPublicImageUrl } from "@/lib/storage/public-image";

type Props = {
  format: (typeof readyInformation.formats)[keyof typeof readyInformation.formats];
  amount?: number;
  titleId: string;
};

export function ReadyCatalogIntro({ format, amount, titleId }: Props) {
  const { catalog } = format;
  const { unit } = getPriceDefinition(catalog.priceCode);

  return (
    <section aria-labelledby={titleId}>
      <div className="flex flex-col gap-y-8">
        <div className={cn("grid grid-cols-12 gap-x-4")}>
          <div
            className={cn("col-span-12 flex flex-col gap-y-4", "lg:col-span-6")}
          >
            <h2
              className={cn(
                "text-brand-milk font-display text-2xl font-semibold",
                "lg:text-3xl",
              )}
              id={titleId}
            >
              {catalog.title}
            </h2>
            <p className="text-brand-neutral text-lg leading-relaxed">
              {catalog.description}
            </p>
          </div>
          <div className={cn("col-span-12", "lg:col-span-6")}>
            <div
              className={cn(
                "flex flex-col gap-y-4 rounded-lg bg-neutral-900 p-5",
                "lg:p-10",
              )}
            >
              <p className="text-brand-milk text-xl font-medium">
                {catalog.includes}
              </p>
              <p
                className={cn(
                  "text-2xl font-semibold",
                  "sm:text-3xl",
                  amount === undefined ? "text-brand-muted" : "text-orange-500",
                )}
              >
                {amount === undefined
                  ? "Стоимость уточняется"
                  : formatPrice(amount, unit)}
              </p>

              <div className="bg-brand-terracota/30 mt-4 flex max-w-md items-center gap-5 rounded-md p-1 py-4 pr-5">
                <SquareText
                  size={24}
                  strokeWidth={1.4}
                  className="text-brand-milk ml-4 shrink-0"
                />
                <p className={cn("text-brand-milk text-sm", "lg:text-base")}>
                  {catalog.priceDescription}
                </p>
              </div>
              <div className="flex max-w-md items-center gap-5 rounded-md bg-neutral-800 p-1 py-4 pr-5">
                <SquareExclamationPoint
                  size={24}
                  strokeWidth={1.4}
                  className="text-brand-neutral ml-4 shrink-0"
                />
                <p className={cn("text-brand-neutral text-sm", "lg:text-base")}>
                  {catalog.note}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={cn("grid grid-cols-12 gap-x-4")}>
          {catalog.products.map((product) => (
            <div
              key={product.id}
              className={cn(
                "col-span-12 flex flex-col gap-y-4",
                "lg:col-span-6",
              )}
            >
              <div className="flex h-full flex-col rounded-b-md bg-neutral-900">
                <div className="relative aspect-3/2 items-center overflow-hidden rounded-t-md">
                  <div className="absolute inset-0 flex size-full items-center justify-center overflow-hidden">
                    <Image
                      src={getPublicImageUrl(product.image.objectKey)}
                      alt={product.image.alt}
                      className="object-cover"
                      fill
                    />
                  </div>
                </div>
                <div className={cn("flex flex-col gap-y-4 p-5", "lg:p-10")}>
                  <h3
                    className={cn(
                      "text-brand-milk font-display text-2xl font-semibold",
                      "lg:text-3xl",
                    )}
                  >
                    {product.title}
                  </h3>
                  <p className="text-brand-neutral text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div
            className={cn("col-span-12 flex flex-col gap-y-4", "lg:col-span-6")}
          ></div>
        </div>
      </div>
      <ReadyComingSoon />
    </section>
  );
}
