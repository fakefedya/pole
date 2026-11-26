import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";

import { materialsInformation } from "./materials-description";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function MaterialsHow() {
  const { how } = materialsInformation;

  return (
    <SiteSection aria-labelledby="materials-how-title">
      <SiteContainer className={cn("pb-24", "lg:pb-48")}>
        <div className="grid grid-cols-12 gap-x-8 gap-y-8">
          <div
            className={cn("col-span-12 flex flex-col gap-y-4", "lg:col-span-6")}
          >
            <h2
              id="materials-how-title"
              className={cn(
                "text-brand-milk font-display text-2xl font-semibold",
                "lg:text-3xl",
              )}
            >
              {how.title}
            </h2>
          </div>
          <div className={cn("col-span-12", "lg:col-span-6 lg:col-start-7")}>
            <div className="flex flex-col gap-y-4">
              {how.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-brand-neutral text-lg leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
              <Link
                href={how.action.href}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "flex h-12 w-fit items-center gap-2 px-5 text-sm",
                  "bg-brand-terracota-accent text-brand-milk",
                  "hover:bg-brand-terracota transition-colors duration-300",
                )}
              >
                {how.action.label}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
