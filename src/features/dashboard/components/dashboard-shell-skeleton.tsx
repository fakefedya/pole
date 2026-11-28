import { Skeleton } from "@/components/ui/skeleton";
import { DashboardPageSkeleton } from "@/features/dashboard/components/dashboard-page-skeleton";

export function DashboardShellSkeleton() {
  return (
    <div className="bg-dashboard-background min-h-dvh md:grid md:grid-cols-[124px_minmax(0,1fr)]" role="status" aria-label="Загружаем панель управления">
      <div aria-hidden="true" className="mx-7 hidden h-dvh items-center md:flex">
        <div className="flex flex-col gap-2 rounded-full bg-brand-charcoal p-2">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="size-12 rounded-full bg-brand-milk/10 motion-reduce:animate-none" />
          ))}
        </div>
      </div>
      <div className="min-w-0 p-7.5">
        <div aria-hidden="true" className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="flex items-center justify-end gap-3">
            <Skeleton className="h-13 w-52 rounded-full bg-dashboard-input motion-reduce:animate-none" />
            <Skeleton className="size-13 rounded-full bg-dashboard-input motion-reduce:animate-none" />
          </div>
          <DashboardPageSkeleton variant="overview" />
        </div>
      </div>
    </div>
  );
}
