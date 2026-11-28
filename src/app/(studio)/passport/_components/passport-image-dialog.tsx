"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { PassportPreview } from "./passport-description";

type Props = {
  preview: PassportPreview;
  imageUrl: string;
  children?: ReactNode;
};

export function PassportImageDialog({ preview, imageUrl, children }: Props) {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!open || !lenis) return;

    lenis.stop();
    return () => lenis.start();
  }, [open, lenis]);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger type="button" aria-label={preview.label}>
        {children ?? preview.label}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent=""
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-5xl"
      >
        <DialogHeader>
          <DialogTitle>{preview.title}</DialogTitle>
          <DialogDescription>{preview.description}</DialogDescription>
        </DialogHeader>
        <Image
          src={imageUrl}
          alt={preview.image.alt}
          width={preview.image.width}
          height={preview.image.height}
          className="h-auto max-w-full"
        />
        <DialogClose type="button">Закрыть</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
