"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { XIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { MaterialProduct } from "./materials-description";
import { cn } from "@/lib/utils";

type Props = {
  material: Pick<MaterialProduct, "title" | "description" | "contents">;
};

export function MaterialsDetailsDialog({ material }: Props) {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!open || !lenis) return;

    lenis.stop();

    return () => lenis.start();
  }, [lenis, open]);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger
        type="button"
        className={cn(
          "text-brand-milk border-brand-terracota-accent flex h-12 w-fit cursor-pointer items-center gap-2 rounded-full border px-5 text-sm",
          "hover:border-brand-terracota hover:text-brand-milk/80 transition-colors duration-300",
        )}
      >
        Посмотреть состав
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent=""
        className={cn(
          "flex max-h-[calc(100dvh-2rem)] flex-col gap-y-8 overflow-y-auto overscroll-contain rounded-lg bg-neutral-900 p-10",
          "lg:max-w-xl",
        )}
      >
        <DialogClose
          type="button"
          aria-label="Закрыть окно"
          className={cn(
            "text-brand-neutral border-brand-milk/15 bg-brand-charcoal/75 absolute top-10 right-10 flex size-12 cursor-pointer items-center justify-center rounded-full border",
            "hover:border-brand-terracota-accent hover:bg-brand-terracota/20 hover:text-brand-milk transition-colors",
            "focus-visible:outline-brand-terracota-accent focus-visible:outline-2 focus-visible:outline-offset-2",
          )}
        >
          <XIcon aria-hidden="true" className="size-4" />
        </DialogClose>
        <DialogHeader className="gap-y-4 pr-9">
          <DialogTitle className="text-brand-milk text-3xl font-medium">
            {material.title}
          </DialogTitle>
          <DialogDescription className="text-brand-neutral text-sm lg:text-lg">
            {material.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <h3 className="text-brand-milk text-xl font-medium">
            Предлагаемый состав
          </h3>
          <ul className="flex flex-col gap-y-4">
            {material.contents.map((item) => (
              <li
                key={item}
                className={cn(
                  "text-brand-neutral relative pl-4 text-sm",
                  "before:bg-brand-neutral before:absolute before:top-3 before:left-0 before:h-1.5 before:w-1.5 before:rounded-full",
                  "lg:text-base",
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
