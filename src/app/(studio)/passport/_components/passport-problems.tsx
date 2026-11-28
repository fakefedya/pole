import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";

import { passportInformation } from "./passport-description";
import { cn } from "@/lib/utils";

export function PassportProblems() {
  const { problems } = passportInformation;

  return (
    <SiteSection aria-labelledby="passport-problems-title">
      <SiteContainer>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex w-full flex-col gap-y-4", "lg:max-w-2/3")}>
            <h2
              className={cn(
                "font-display text-brand-milk text-2xl leading-[1.2] font-semibold uppercase",
                "lg:text-4xl",
              )}
              id="passport-problems-title"
            >
              {problems.title}
            </h2>
            <p className="text-brand-neutral text-lg leading-relaxed">
              {problems.description}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {problems.items.map((item) => (
              <article
                className={cn(
                  "col-span-6 flex flex-col gap-4 rounded-lg bg-neutral-900 p-5",
                  "h-full lg:p-10",
                )}
                key={item.title}
              >
                <h3 className="text-brand-milk font-display text-xl font-medium">
                  {item.title}
                </h3>
                <p className="text-brand-neutral text-sm lg:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div
            className={cn("mt-4 flex w-full flex-col gap-y-4", "lg:max-w-2/3")}
          >
            <blockquote
              className={cn(
                "text-brand-milk font-display text-2xl font-semibold",
                "lg:text-3xl",
              )}
            >
              {problems.conclusion}
            </blockquote>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
