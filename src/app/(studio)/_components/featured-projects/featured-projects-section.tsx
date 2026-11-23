import Link from "next/link";
import { SiteContainer } from "@/components/layout/site-container";
import { getFeaturedProjects } from "@/features/projects/server/public-queries";
import { PublicProjectCards } from "@/app/(studio)/_components/featured-projects/public-project-cards";
import { SiteSection } from "@/components/layout/site-section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export async function FeaturedProjectsSection() {
  const projects = await getFeaturedProjects();
  if (!projects.length) return null;
  return (
    <SiteSection id="featured-projects" className="min-h-dvh">
      <SiteContainer>
        <div className="flex flex-col gap-y-8">
          <div className={cn("flex max-w-full flex-col gap-4", "lg:max-w-2/3")}>
            <h2
              id="featured-projects-title"
              className={cn(
                "font-display text-brand-milk text-3xl leading-[1.2] font-semibold whitespace-pre-line uppercase",
                "lg:text-4xl",
                "xl:text-6xl",
              )}
            >
              Последние проекты
            </h2>
            <p className={cn("text-brand-neutral text-xl", "lg:text-2xl")}>
              Разрабатываем индивидуальные проекты, предлагаем готовые решения и
              создаём понятные инструменты для самостоятельной работы с
              интерьером.
            </p>
            <Link
              href="/projects"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "flex h-12 w-fit items-center gap-2 px-5 text-sm",
                "bg-brand-terracota-accent",
                "hover:bg-brand-terracota transition-colors duration-300",
              )}
            >
              Смотреть все проекты
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <PublicProjectCards projects={projects} layout="expandable" />
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
