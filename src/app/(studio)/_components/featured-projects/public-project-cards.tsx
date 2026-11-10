import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PublicProjectCard } from "@/features/projects/server/public-queries";

type PublicProjectCardsProps = {
  projects: PublicProjectCard[];
  layout?: "grid" | "expandable";
};

export function PublicProjectCards({
  projects,
  layout = "grid",
}: PublicProjectCardsProps) {
  if (!projects.length) {
    return (
      <p className="py-12 text-base opacity-65">
        Опубликованных проектов пока нет.
      </p>
    );
  }

  const isExpandable = layout === "expandable";

  return (
    <div
      className={cn(
        "gap-x-4 gap-y-12",
        isExpandable
          ? "grid grid-cols-1 md:grid-cols-2 lg:flex lg:items-start"
          : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
      )}
    >
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          className={cn(
            "group relative block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4",
            isExpandable
              ? "focus-visible:outline-brand-milk"
              : "focus-visible:outline-brand-charcoal",
            isExpandable &&
              "motion-reduce:transition-none lg:grow lg:basis-0 lg:transition-[flex-grow] lg:duration-1000 lg:ease-[cubic-bezier(0.22,1,0.36,1)] lg:hover:grow-[1.75] lg:focus-visible:grow-[1.75]",
          )}
        >
          <div
            className={cn(
              "bg-brand-espresso relative overflow-hidden rounded-2xl",
              isExpandable
                ? "aspect-4/5 lg:aspect-auto lg:h-[60dvh]"
                : "aspect-4/5",
            )}
          >
            <Image
              src={project.coverUrl}
              alt={project.coverAlt}
              fill
              sizes={
                isExpandable
                  ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              }
              className={cn(
                "object-cover",
                !isExpandable &&
                  "transition-transform duration-1000 group-hover:scale-105 motion-reduce:transition-none",
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute top-0 left-0 z-0 h-full w-full bg-black/25",
                "transition-colors duration-300 group-hover:bg-black/50",
              )}
            ></div>
          </div>
          <div className="absolute top-4 left-4">
            <h3
              className={cn(
                "font-display text-brand-milk text-2xl leading-tight",
              )}
            >
              {project.title}
            </h3>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="flex gap-2">
              {project.location && (
                <span
                  className={cn(
                    "text-brand-milk border-brand-milk/5 rounded-full border bg-black/5 px-2 py-1 text-base font-medium opacity-0 backdrop-blur-md",
                    "transition-all duration-300 group-hover:opacity-100",
                  )}
                >
                  {project.location}
                </span>
              )}
              {project.areaSqM && (
                <span
                  className={cn(
                    "text-brand-milk border-brand-milk/5 rounded-full border bg-black/5 px-2 py-1 text-base font-medium opacity-0 backdrop-blur-md",
                    "transition-all duration-300 group-hover:opacity-100",
                  )}
                >
                  {project.areaSqM} м²
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
