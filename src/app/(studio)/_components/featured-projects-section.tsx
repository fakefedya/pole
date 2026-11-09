import Link from "next/link";
import { SiteContainer } from "@/components/layout/site-container";
import { getFeaturedProjects } from "@/features/projects/server/public-queries";
import { PublicProjectCards } from "@/features/projects/components/public-project-cards";
import { SiteSection } from "@/components/layout/site-section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function FeaturedProjectsSection() {
  const projects = await getFeaturedProjects();
  if (!projects.length) return null;
  return (
    <SiteSection id="featured-projects" className="min-h-dvh">
      <SiteContainer className="gap-8 p-10">
        <div className="flex max-w-2/3 flex-col gap-4">
          <h2
            id="featured-projects-title"
            className="font-display text-brand-milk text-4xl leading-[1.2] font-semibold uppercase md:text-6xl"
          >
            Последние проекты
          </h2>
          <p className="text-brand-neutral text-2xl">
            Разрабатываем индивидуальные проекты, предлагаем готовые решения и
            создаём понятные инструменты для самостоятельной работы с
            интерьером.
          </p>
          <Link
            href="/projects"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-12 w-fit px-5 text-sm",
              "bg-brand-terracota-accent",
              "hover:bg-brand-terracota transition-colors duration-300",
            )}
          >
            Смотреть все проекты
          </Link>
        </div>
        <PublicProjectCards projects={projects} layout="expandable" />
        <div className="flex"></div>
      </SiteContainer>
    </SiteSection>
  );
}
