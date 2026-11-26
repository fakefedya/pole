"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig, motion } from "motion/react";

import {
  isCurrentPath,
  type SiteNavigationItem,
} from "@/config/site-navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type DesktopNavigationProps = {
  siteNavigation: readonly SiteNavigationItem[];
  onMenuOpenChange?: (open: boolean) => void;
};

type PillPosition = {
  x: number;
  width: number;
};

const navigationItemClassName = cn(
  "relative isolate h-full rounded-full px-5 py-0",
  "text-base text-brand-milk",
  "bg-transparent!",
  "transition-colors duration-300 hover:text-brand-milk/70 data-popup-open:hover:text-brand-milk/70 data-popup-open:text-brand-milk/70 data-open:text-brand-milk/70",
  "[&_svg]:relative [&_svg]:size-3.5 [&_svg]:z-10",
);

export function DesktopNavigation({
  siteNavigation,
  onMenuOpenChange,
}: DesktopNavigationProps) {
  const pathname = usePathname();
  const menuAnchorRef = useRef<HTMLDivElement>(null);
  const [pillPosition, setPillPosition] = useState<PillPosition | null>(null);

  const visibleItems = siteNavigation.filter(
    (item) =>
      item.isVisible !== false &&
      item.label.toLowerCase() !== "политики" &&
      (item.type === "link" ||
        item.items.some((child) => child.isVisible !== false)),
  );

  const activeIndex = visibleItems.findIndex((item) => {
    if (item.type === "link") {
      return isCurrentPath(item.href, pathname);
    }

    return item.items.some(
      (child) =>
        child.isVisible !== false && isCurrentPath(child.href, pathname),
    );
  });

  useLayoutEffect(() => {
    const container = menuAnchorRef.current;
    const activeItem = container?.querySelector<HTMLElement>(
      `[data-nav-index="${activeIndex}"]`,
    );
    const activeControl = activeItem?.querySelector<HTMLElement>(
      '[data-slot="navigation-menu-link"], [data-slot="navigation-menu-trigger"]',
    );

    if (!container || !activeControl) {
      setPillPosition(null);
      return;
    }

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const controlRect = activeControl.getBoundingClientRect();

      if (controlRect.width === 0 || containerRect.width === 0) {
        setPillPosition(null);
        return;
      }

      const next = {
        x: controlRect.left - containerRect.left,
        width: controlRect.width,
      };

      setPillPosition((previous) =>
        previous &&
        Math.abs(previous.x - next.x) < 0.5 &&
        Math.abs(previous.width - next.width) < 0.5
          ? previous
          : next,
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    container
      .querySelectorAll<HTMLElement>(
        '[data-slot="navigation-menu-link"], [data-slot="navigation-menu-trigger"]',
      )
      .forEach((control) => observer.observe(control));

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [activeIndex, pathname, siteNavigation]);

  if (visibleItems.length === 0) return null;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={menuAnchorRef}
        className="relative isolate flex w-fit rounded-full bg-black/50 p-1.5 backdrop-blur-lg"
      >
        {pillPosition && (
          <motion.span
            initial={false}
            animate={{ x: pillPosition.x, width: pillPosition.width }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className="bg-brand-terracota-accent pointer-events-none absolute inset-y-1.5 left-0 z-0 rounded-full"
            aria-hidden="true"
          />
        )}
        <NavigationMenu
          aria-label="Основная навигация"
          className="relative z-10"
          anchor={menuAnchorRef}
          align="center"
          sideOffset={4}
          matchAnchorWidth
          onValueChange={(value) => onMenuOpenChange?.(value !== null)}
        >
          <NavigationMenuList>
            {visibleItems.map((item, index) => {
              const isSelected = index === activeIndex;

              if (item.type === "link") {
                return (
                  <NavigationMenuItem
                    key={item.href}
                    data-nav-index={index}
                    className="flex h-11.5 items-center"
                  >
                    <NavigationMenuLink
                      render={<Link href={item.href} />}
                      active={isSelected}
                      aria-current={isSelected ? "page" : undefined}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        navigationItemClassName,
                        isSelected && "hover:text-brand-milk",
                      )}
                    >
                      <span className="relative z-10">{item.label}</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              }

              const visibleChildren = item.items.filter(
                (child) => child.isVisible !== false,
              );

              return (
                <NavigationMenuItem
                  key={item.label}
                  data-nav-index={index}
                  className="flex h-11.5 items-center"
                >
                  <NavigationMenuTrigger
                    data-active={isSelected || undefined}
                    className={navigationItemClassName}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </NavigationMenuTrigger>

                  <NavigationMenuContent className="w-full p-1.5">
                    <ul className="grid w-full grid-cols-2 gap-1.5">
                      {visibleChildren.map((child) => {
                        const isCurrent = isCurrentPath(child.href, pathname);

                        return (
                          <li key={child.href}>
                            <NavigationMenuLink
                              render={<Link href={child.href} />}
                              active={isCurrent}
                              aria-current={isCurrent ? "page" : undefined}
                              closeOnClick
                              className={cn(
                                "bg-brand-milk/5 relative flex h-40 w-full flex-col items-start justify-between overflow-hidden p-8",
                                "hover:bg-brand-milk/10 transition-colors duration-300",
                                "focus:bg-brand-milk/10",
                              )}
                            >
                              <div className="text-brand-milk flex flex-col gap-4">
                                <span className="text-base font-semibold">
                                  {child.label}
                                </span>
                                <p className="text-brand-neutral text-sm">
                                  {child.description}
                                </p>
                              </div>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </MotionConfig>
  );
}
