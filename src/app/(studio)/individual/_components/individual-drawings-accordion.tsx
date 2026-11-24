"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  items: readonly string[];
};

export function IndividualDrawingsAccordion({ title, items }: Props) {
  return (
    <Accordion className={cn("border-brand-milk/15 rounded-lg border")}>
      <AccordionItem value="working-drawings" className="border-0">
        <AccordionTrigger
          className={cn(
            "cursor-pointer items-center gap-4 border-x-0 border-t-0 p-5 text-left text-[19px] leading-6 hover:no-underline",
            "aria-expanded:border-b-white/15",
            "focus-visible:ring-brand-neutral focus-visible:ring-2 focus-visible:ring-inset",
            "**:data-[slot=accordion-trigger-icon]:hidden!",
          )}
        >
          <span className="text-brand-milk text-xl font-medium">{title}</span>
          <span
            aria-hidden="true"
            className="text-brand-neutral ml-auto shrink-0 text-3xl leading-none"
          >
            <span className="group-aria-expanded/accordion-trigger:hidden">
              +
            </span>
            <span className="hidden group-aria-expanded/accordion-trigger:inline">
              −
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-5 pt-2 pb-5">
          <ol className="list-none">
            {items.map((item, index) => (
              <li
                key={item}
                className="text-brand-milk border-brand-milk/15 flex items-start gap-3 border-b py-3 text-lg leading-[1.45]"
              >
                <span
                  aria-hidden="true"
                  className="text-brand-terracota-accent w-6 shrink-0 text-sm leading-6 font-medium"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
