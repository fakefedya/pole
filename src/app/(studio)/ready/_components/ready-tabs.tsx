"use client";

import type { ReactNode } from "react";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { readyInformation } from "./ready-description";
import { cn } from "@/lib/utils";

type Props = {
  interiors: ReactNode;
  capsules: ReactNode;
};

export function ReadyTabs({ interiors, capsules }: Props) {
  const { formats } = readyInformation;

  return (
    <SiteSection aria-label="Выбор готового решения">
      <SiteContainer className={cn("pt-5 pb-32", "lg:pt-10 lg:pb-48")}>
        <Tabs className={cn("gap-12", "lg:gap-24")} defaultValue="interiors">
          <TabsList
            className="min-h-fit bg-neutral-900"
            aria-label="Формат готового решения"
          >
            <TabsTrigger
              className={cn(
                "text-brand-milk/60 cursor-pointer p-4 text-base font-medium",
                "data-active:bg-brand-terracota-accent data-active:text-brand-milk",
                "hover:data-active:text-brand-milk transition-colors duration-300",
                "hover:text-brand-milk",
                "lg:px-10 lg:py-5 lg:text-xl",
              )}
              value="interiors"
            >
              {formats.interiors.label}
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "text-brand-milk/60 cursor-pointer p-4 text-base font-medium",
                "data-active:bg-brand-terracota-accent data-active:text-brand-milk",
                "hover:data-active:text-brand-milk transition-colors duration-300",
                "hover:text-brand-milk",
                "lg:px-10 lg:py-5 lg:text-xl",
              )}
              value="capsules"
            >
              {formats.capsules.label}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="interiors">{interiors}</TabsContent>
          <TabsContent value="capsules">{capsules}</TabsContent>
        </Tabs>
      </SiteContainer>
    </SiteSection>
  );
}
