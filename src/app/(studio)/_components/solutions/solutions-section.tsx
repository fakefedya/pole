import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { solutions, solutionThemes } from "./solutions";
import Image from "next/image";

export function SolutionsSection() {
  return (
    <SiteSection id="solutions" className="relative isolate">
      {solutions.map((solution, index) => (
        <article
          key={solution.title}
          style={{ zIndex: index + 1 }}
          className={cn(
            "relative flex min-h-dvh w-full flex-col items-center",
            "md:sticky md:top-0 md:h-dvh",
            solutionThemes[index % solutionThemes.length],
          )}
        >
          <SiteContainer className={cn("h-full p-5", "lg:p-10")}>
            <div className="flex h-full flex-col justify-between">
              <div
                className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}
              >
                <h2
                  className={cn(
                    "font-display text-3xl leading-[1.2] font-semibold uppercase",
                    "lg:text-4xl",
                    "xl:text-6xl",
                  )}
                >
                  {solution.title}
                </h2>

                {/* Варианты услуг */}
                <div className="flex flex-wrap gap-2">
                  {solution.options.map((option) => (
                    <span
                      key={option}
                      className="rounded-full border border-current/25 px-4 py-1 text-sm"
                    >
                      {option}
                    </span>
                  ))}
                </div>

                {/* Описание */}
                <p className={cn("text-xl", "lg:text-2xl")}>
                  {solution.description}
                </p>

                {/* CTA */}
                <div>
                  <Link
                    href={solution.action.href}
                    className={cn(
                      "inline-flex items-center justify-center",
                      "rounded-full px-6 py-3",
                      "text-sm font-medium",
                      "transition-opacity hover:opacity-80",
                      solution.action.bgColor,
                      solution.action.textColor,
                    )}
                  >
                    {solution.action.label}
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {solution.images.map((image) => (
                  <div
                    key={image.alt}
                    className="relative flex aspect-4/5 items-center justify-center overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </SiteContainer>
        </article>
      ))}
    </SiteSection>
  );
}
