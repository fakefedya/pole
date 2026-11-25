import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"section">;

export function SiteSection({ children, className, ...props }: Props) {
  return (
    <section
      {...props}
      className={cn("flex w-full flex-col items-center", className)}
    >
      {children}
    </section>
  );
}
