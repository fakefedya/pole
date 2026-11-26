import Link from "next/link";

import { formatPrice } from "@/features/prices/config/price-catalog";

import type { MaterialProduct } from "./materials-description";
import { MaterialsDetailsDialog } from "./materials-details-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  material: MaterialProduct;
};

export function MaterialsCard({ material }: Props) {
  const price =
    material.price === null
      ? "Стоимость уточняется"
      : material.price === 0
        ? "Бесплатно"
        : formatPrice(material.price, "RUB_FIXED");

  return (
    <article
      className={cn(
        "group col-span-12 flex flex-col overflow-hidden rounded-md bg-neutral-900",
        "lg:col-span-4",
      )}
    >
      <div
        className={cn(
          "group flex h-fit w-full flex-col items-center p-5",
          "lg:p-10",
          material.coverColor,
        )}
      >
        <div
          className={cn(
            "bg-brand-milk flex aspect-3/4 h-60 flex-col justify-between p-6",
            "group-odd:-rotate-4",
            "group-even:rotate-4",
            "transition-transform duration-300 group-hover:rotate-0",
          )}
        >
          <span className="font-display text-brand-terracota text-xl font-medium">
            POLE
          </span>
          <span className="text-brand-charcoal font-display mt-4 mb-auto text-lg leading-tight">
            {material.title}
          </span>
          <div className="flex flex-col gap-5">
            <i className="border-brand-charcoal/30 h-1 border-b"></i>
            <i className="border-brand-charcoal/30 h-1 border-b"></i>
            <i className="border-brand-charcoal/30 h-1 border-b"></i>
          </div>
        </div>
      </div>
      <div className={cn("flex flex-col gap-y-4 p-5", "lg:p-10")}>
        <span
          className={cn(
            "w-fit rounded-full border border-current/25 px-2 py-1 text-sm font-medium",
            "bg-brand-terracota/10 text-brand-terracota-accent lg:px-4",
          )}
        >
          {material.type}
        </span>

        <h3 className="text-brand-milk text-xl font-medium">
          {material.title}
        </h3>
        <p className="text-brand-neutral text-sm lg:text-base">
          {material.description}
        </p>
        <p
          className={cn(
            price === "Стоимость уточняется" && "text-brand-muted",
            (price === "Бесплатно" || price !== "Стоимость уточняется") &&
              "text-2xl text-orange-500",
            "flex min-h-8 items-end font-semibold",
          )}
        >
          {price}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <MaterialsDetailsDialog material={material} />
          <Link
            href="/contacts"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "flex h-12 w-fit items-center gap-2 px-5 text-sm",
              "bg-brand-terracota-accent text-brand-milk",
              "hover:bg-brand-terracota transition-colors duration-300",
            )}
          >
            Купить
          </Link>
        </div>
      </div>
    </article>
  );
}
