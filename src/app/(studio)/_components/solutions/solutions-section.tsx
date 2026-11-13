import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { solutions, solutionThemes } from "./solutions";
import Image from "next/image";
import { Fragment } from "react";

export function SolutionsSection() {
  return (
    <SiteSection id="solutions" className="relative isolate">
      {solutions.map((solution, index) => (
        <Fragment key={solution.title}>
          <article
            style={{ zIndex: index + 1 }}
            className={cn(
              "sticky top-0 flex h-dvh w-full flex-col items-center",
              solutionThemes[index % solutionThemes.length],
            )}
          >
            <SiteContainer
              className={cn("h-full min-h-0 p-5", "md:p-5 lg:p-10")}
            >
              <div className="flex h-full min-h-0 flex-col justify-between gap-4 md:gap-0">
                <div
                  className={cn(
                    "flex max-w-full flex-col gap-4",
                    "lg:max-w-2/3",
                  )}
                >
                  <h2
                    className={cn(
                      "font-display text-2xl leading-[1.2] font-semibold uppercase",
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
                        className={cn(
                          "rounded-full border border-current/25 px-2 py-1 text-sm",
                          "lg:px-4",
                        )}
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
                <div
                  role="region"
                  aria-label={`Примеры интерьеров: ${solution.title}`}
                  tabIndex={0}
                  className={cn(
                    "-mx-5 flex shrink-0 gap-3 overflow-x-auto px-5",
                    "snap-x snap-mandatory scroll-px-5 overscroll-x-contain",
                    "scrollbar-none [&::-webkit-scrollbar]:hidden",
                    "md:mx-0 md:grid md:w-full md:snap-none md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0",
                  )}
                >
                  {solution.images.map((image) => (
                    <div
                      key={image.alt}
                      className={cn(
                        "relative h-[clamp(24rem,45dvh,28rem)] w-[78vw] max-w-88 shrink-0 snap-start overflow-hidden rounded-lg",
                        "md:aspect-4/5 md:h-auto md:w-auto md:max-w-none",
                      )}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 767px) 78vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SiteContainer>
          </article>
          {index < solutions.length - 1 && (
            <div aria-hidden="true" className="h-[50dvh] w-full shrink-0" />
          )}
        </Fragment>
      ))}
    </SiteSection>
  );
}
