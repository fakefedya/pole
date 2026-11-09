"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  isCurrentPath,
  type SiteNavigationItem,
} from "@/config/site-navigation";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  siteNavigation: readonly SiteNavigationItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNavigation({
  siteNavigation,
  open,
  onOpenChange,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis, open]);

  const closeMenu = () => onOpenChange(false);

  const items = siteNavigation.filter(
    (item) =>
      item.isVisible !== false &&
      (item.type === "link" ||
        item.items.some((child) => child.isVisible !== false)),
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className="w-fit rounded-full bg-black/50 p-1.5 backdrop-blur-lg">
        <div className="align-center flex h-fit w-full items-center gap-x-16 px-4 py-2">
          <Link href={"/"}>
            <svg
              aria-hidden="true"
              focusable="false"
              width="456"
              height="114"
              viewBox="0 0 456 114"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand-milk h-5 w-auto"
            >
              <path d="M95.41 19.2C91.9659 13.7231 87 9.36886 81.12 6.67001C74.9467 3.69667 67.5866 2.21333 59.04 2.21999H3.10999C2.28516 2.21999 1.49413 2.5477 0.910889 3.13094C0.327651 3.71418 0 4.50522 0 5.33004V108.44C0 109.265 0.327651 110.056 0.910889 110.639C1.49413 111.222 2.28516 111.55 3.10999 111.55H19.78C20.6048 111.55 21.3958 111.222 21.9791 110.639C22.5623 110.056 22.89 109.265 22.89 108.44V73.36H59.04C67.5866 73.36 74.9467 71.8767 81.12 68.91C86.985 66.2213 91.9476 61.8942 95.41 56.45C98.704 50.7957 100.44 44.3689 100.44 37.825C100.44 31.2812 98.704 24.8544 95.41 19.2ZM72.16 49.89C68.76 52.7967 64.0467 54.2534 58.02 54.26H22.93V21.32H58.06C64.06 21.32 68.7733 22.8 72.2 25.76C75.6267 28.72 77.3267 32.72 77.3 37.76C77.2733 42.96 75.56 47.0034 72.16 49.89Z" />
              <path d="M173.32 113.74C160.687 113.74 149.61 111.357 140.09 106.59C130.936 102.163 123.227 95.227 117.86 86.59C112.573 78.0634 109.93 68.16 109.93 56.88C109.93 45.6 112.58 35.69 117.88 27.15C123.247 18.5131 130.956 11.5775 140.11 7.15002C149.63 2.38336 160.707 0 173.34 0C185.973 0 197.053 2.38336 206.58 7.15002C215.73 11.5835 223.438 18.5177 228.81 27.15C234.11 35.6967 236.76 45.6067 236.76 56.88C236.76 68.1533 234.11 78.0667 228.81 86.62C223.438 95.2523 215.73 102.187 206.58 106.62C197.047 111.36 185.96 113.733 173.32 113.74ZM173.32 93.18C181.58 93.18 188.7 91.7233 194.68 88.81C200.449 86.0851 205.29 81.7243 208.6 76.27C211.933 70.83 213.6 64.3667 213.6 56.88C213.6 49.3933 211.933 42.9333 208.6 37.5C205.287 32.048 200.447 27.6879 194.68 24.96C188.68 22.04 181.56 20.5834 173.32 20.59C165.16 20.59 158.067 22.0467 152.04 24.96C146.24 27.67 141.37 32.0324 138.04 37.5C134.707 42.94 133.04 49.4 133.04 56.88C133.04 64.36 134.707 70.8233 138.04 76.27C141.367 81.7399 146.238 86.1031 152.04 88.81C158.073 91.7233 165.167 93.18 173.32 93.18Z" />
              <path d="M382.8 47.85H448.23C448.73 47.8501 449.222 47.9689 449.667 48.1964C450.112 48.4239 450.497 48.7537 450.79 49.1587C451.083 49.5638 451.275 50.0325 451.352 50.5264C451.428 51.0204 451.387 51.5254 451.23 52L447.33 63.76C447.123 64.3911 446.721 64.9401 446.182 65.3283C445.643 65.7164 444.994 65.9236 444.33 65.92H382.8V89.2C382.8 90.0248 383.128 90.8159 383.711 91.3991C384.294 91.9824 385.085 92.31 385.91 92.31H452.03C452.526 92.3045 453.016 92.4172 453.459 92.6389C453.903 92.8605 454.287 93.1847 454.581 93.5845C454.874 93.9843 455.068 94.4482 455.146 94.9379C455.224 95.4275 455.184 95.9288 455.03 96.4L450.72 109.4C450.509 110.026 450.105 110.57 449.566 110.952C449.027 111.335 448.381 111.537 447.72 111.53H362.72C361.895 111.53 361.104 111.202 360.521 110.619C359.938 110.036 359.61 109.245 359.61 108.42V5.33003C359.61 4.50521 359.938 3.71417 360.521 3.13093C361.104 2.5477 361.895 2.21998 362.72 2.21998H452.72C453.217 2.21223 453.708 2.32352 454.153 2.54451C454.597 2.7655 454.983 3.08981 455.276 3.49025C455.57 3.89069 455.764 4.35563 455.841 4.8462C455.918 5.33678 455.877 5.83872 455.72 6.31001L451.41 19.31C451.202 19.938 450.798 20.4832 450.259 20.8662C449.719 21.2493 449.072 21.4503 448.41 21.44H385.93C385.522 21.44 385.117 21.5205 384.74 21.6768C384.362 21.8331 384.02 22.0621 383.731 22.3509C383.442 22.6397 383.213 22.9826 383.057 23.3599C382.9 23.7372 382.82 24.1416 382.82 24.55L382.8 47.85Z" />
              <path d="M344.87 91.29H280.37C279.545 91.29 278.754 90.9623 278.171 90.3791C277.588 89.7959 277.26 89.0048 277.26 88.18V6.56002C277.266 6.06421 277.153 5.57424 276.931 5.1307C276.71 4.68715 276.385 4.30281 275.986 4.00954C275.586 3.71628 275.122 3.52253 274.632 3.44436C274.142 3.36618 273.641 3.40583 273.17 3.56002L256.51 9.08004C255.879 9.28535 255.331 9.68751 254.946 10.2275C254.561 10.7675 254.359 11.4168 254.37 12.08V108.48C254.37 109.305 254.698 110.096 255.281 110.679C255.864 111.262 256.655 111.59 257.48 111.59H340.23C340.892 111.6 341.539 111.399 342.079 111.016C342.618 110.633 343.022 110.088 343.23 109.46L347.88 95.41C348.043 94.9362 348.089 94.43 348.014 93.9346C347.939 93.4392 347.746 92.9692 347.45 92.5646C347.154 92.16 346.766 91.8328 346.316 91.6109C345.867 91.389 345.371 91.2789 344.87 91.29Z" />
            </svg>
          </Link>
          <SheetTrigger aria-label="Открыть меню сайта">
            <Menu aria-hidden="true" size={24} className="text-brand-milk" />
          </SheetTrigger>
        </div>
      </div>

      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn(
          "max-h-[min(88dvh,760px)] rounded-t-4xl",
          "border-none bg-black/50 backdrop-blur-lg",
          "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "data-[side=bottom]:data-starting-style:translate-y-full",
          "data-[side=bottom]:data-ending-style:translate-y-full",
          "motion-reduce:transition-none",
        )}
      >
        <SheetHeader className="flex-row items-center justify-between p-5">
          <SheetTitle className="font-display text-brand-milk text-xl uppercase">
            Меню
          </SheetTitle>
          <SheetClose
            className="bg-brand-milk/10 text-brand-milk focus-visible:ring-brand-terracota-accent grid size-11 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2"
            aria-label="Закрыть меню"
          >
            <X aria-hidden="true" size={24} />
          </SheetClose>
        </SheetHeader>

        <nav
          aria-label="Мобильная навигация"
          data-lenis-prevent
          className="min-h-0 overflow-y-auto overscroll-contain px-5 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          <Accordion multiple className={"border-none"}>
            {items.map((item) => {
              if (item.type === "link") {
                const active = isCurrentPath(item.href, pathname);

                return (
                  <div
                    key={item.href}
                    className="border-brand-milk/15 border-b"
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMenu}
                      className={cn(
                        "flex min-h-14 items-center py-4 text-lg font-semibold",
                        "outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2",
                        active
                          ? "text-brand-terracota-accent"
                          : "text-brand-milk",
                      )}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              }

              const children = item.items.filter(
                (child) => child.isVisible !== false,
              );
              const active = children.some((child) =>
                isCurrentPath(child.href, pathname),
              );

              return (
                <AccordionItem
                  key={item.label}
                  value={item.label}
                  className="border-brand-milk/15"
                >
                  <AccordionTrigger
                    className={cn(
                      "focus-visible:outline-brand-terracota-accent items-center px-0 text-lg font-semibold",
                      active
                        ? "text-brand-terracota-accent"
                        : "text-brand-milk",
                    )}
                  >
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-4 flex flex-col gap-1 gap-y-4">
                      {children.map((child) => {
                        const childActive = isCurrentPath(child.href, pathname);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            aria-current={childActive ? "page" : undefined}
                            onClick={closeMenu}
                            className={cn(
                              "flex flex-col gap-2 rounded-lg p-5 outline-none",
                              "focus-visible:ring-brand-terracota-accent focus-visible:ring-2",
                              childActive
                                ? "bg-brand-terracota-accent/20 text-brand-milk"
                                : "bg-brand-milk/5 text-brand-milk hover:bg-brand-milk/10",
                            )}
                          >
                            <span className="text-base font-medium">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="text-brand-milk/60 text-sm leading-relaxed">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
