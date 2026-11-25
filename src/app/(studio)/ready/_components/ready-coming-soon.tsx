import { cn } from "@/lib/utils";

import { readyInformation } from "./ready-description";

export function ReadyComingSoon() {
  return (
    <div className={cn("relative -mt-40 min-h-48 overflow-hidden")}>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "via-brand-black/80 to-brand-black bg-linear-to-b from-transparent",
        )}
      />
      <div className="relative flex min-h-60 items-end justify-center pb-8">
        <div className="bg-brand-terracota/80 text-brand-milk/50 flex cursor-not-allowed items-center gap-4 rounded-md px-5 py-2">
          <p className="text-lg font-medium">
            {readyInformation.upcoming.title}
          </p>
        </div>
      </div>
    </div>
  );
}
