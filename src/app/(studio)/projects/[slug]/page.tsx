import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Images, SquareText } from "lucide-react";

import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { getPublishedProjectBySlug } from "@/features/projects/server/public-queries";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Проект не найден | STUDIO POLE",
      robots: { index: false },
    };
  }

  return {
    title: `${project.title} | STUDIO POLE`,
    description:
      project.summary ?? `Дизайн интерьера ${project.title} от STUDIO POLE`,
    openGraph: {
      title: project.title,
      description: project.summary ?? undefined,
      images: project.coverUrl ? [{ url: project.coverUrl }] : [],
    },
  };
}

async function PublishedProject({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const galleryImages = project.images.filter(
    (image) => image.id !== project.coverImageId,
  );
  const hasDescription = project.blocks.length > 0;
  const hasGallery = galleryImages.length > 0;

  return (
    <article
      className={cn(
        "bg-brand-milk text-brand-charcoal px-5 pt-35 pb-[calc(8rem+env(safe-area-inset-bottom))]",
        "lg:px-10 lg:pt-40 lg:pb-40",
      )}
    >
      <SiteContainer className={cn("mx-auto gap-12", "lg:gap-20", "xl:gap-24")}>
        <header className={cn("flex flex-col gap-6", "sm:gap-8", "lg:gap-10")}>
          <div className={cn("flex min-w-0 flex-col gap-3", "sm:gap-4")}>
            <h1
              className={cn(
                "font-display text-3xl leading-[1.15] font-semibold wrap-break-word uppercase",
                "sm:text-4xl",
                "lg:text-5xl",
                "xl:text-6xl",
              )}
            >
              {project.title}
            </h1>

            {project.summary && (
              <p className={cn("text-brand-muted text-xl", "lg:text-2xl")}>
                {project.summary}
              </p>
            )}
          </div>

          <div className="grid grid-cols-12 gap-y-4">
            <dl
              className={cn(
                "col-span-12 grid grid-cols-12 gap-y-2 text-sm uppercase",
                "lg:col-span-6 lg:text-base",
              )}
            >
              {project.location && (
                <>
                  <span className="col-span-6 font-medium">Локация:</span>
                  <span className="col-span-6">{project.location}</span>
                </>
              )}
              {project.areaSqM && (
                <>
                  <span className="col-span-6 font-medium">Площадь:</span>
                  <span className="col-span-6">{project.areaSqM} м²</span>
                </>
              )}
              {project.style && (
                <>
                  <span className="col-span-6 font-medium">Стиль:</span>
                  <span className="col-span-6">{project.style}</span>
                </>
              )}
              {project.year && (
                <>
                  <span className="col-span-6 font-medium">Год:</span>
                  <span className="col-span-6">{project.year}</span>
                </>
              )}
            </dl>
          </div>

          {(hasDescription || hasGallery) && (
            <nav
              aria-label="Разделы проекта"
              className={cn(
                "flex flex-col gap-2",
                "sm:flex-row sm:flex-wrap sm:items-center",
              )}
            >
              {hasDescription && (
                <Button
                  nativeButton={false}
                  render={
                    <a href="#project-description">
                      Описание проекта
                      <SquareText size={18} aria-hidden="true" />
                    </a>
                  }
                  className={cn(
                    "bg-brand-charcoal text-brand-milk flex h-12 w-full cursor-pointer items-center justify-center gap-2 px-5 text-sm transition-colors duration-300",
                    "sm:w-auto",
                    "hover:bg-brand-terracota focus-visible:ring-brand-terracota-accent focus-visible:ring-2",
                  )}
                />
              )}
              {hasGallery && (
                <Button
                  nativeButton={false}
                  render={
                    <a href="#project-gallery">
                      Галерея проекта
                      <Images size={18} aria-hidden="true" />
                    </a>
                  }
                  className={cn(
                    "bg-brand-charcoal text-brand-milk flex h-12 w-full cursor-pointer items-center justify-center gap-2 px-5 text-sm transition-colors duration-300",
                    "sm:w-auto",
                    "hover:bg-brand-terracota focus-visible:ring-brand-terracota-accent focus-visible:ring-2",
                  )}
                />
              )}
            </nav>
          )}
        </header>

        {project.coverUrl && (
          <div
            className={cn(
              "bg-brand-espresso relative aspect-4/3 w-full overflow-hidden rounded-lg",
              "sm:aspect-3/2",
              "xl:aspect-video",
            )}
          >
            <Image
              src={project.coverUrl}
              alt={project.coverImage?.alt ?? project.title}
              fill
              priority
              sizes="(max-width: 1023px) calc(100vw - 40px), (max-width: 1359px) calc(100vw - 80px), 1280px"
              className="object-cover"
            />
          </div>
        )}

        {hasDescription && (
          <section
            id="project-description"
            aria-labelledby="project-description-title"
            className={cn(
              "grid scroll-mt-24 grid-cols-1 gap-y-6",
              "lg:scroll-mt-32 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0",
            )}
          >
            <div className="lg:col-span-6">
              <h2
                id="project-description-title"
                className={cn(
                  "font-display text-2xl font-semibold",
                  "lg:text-4xl",
                )}
              >
                Описание проекта
              </h2>
            </div>
            <div className="min-w-0 lg:col-span-6">
              <div className={cn("flex flex-col gap-4", "lg:gap-5")}>
                {project.blocks.map((block) =>
                  block.type === "HEADING" ? (
                    <h3
                      key={block.id}
                      className={cn(
                        "font-display text-brand-muted pt-4 text-xl leading-snug first:pt-0",
                        "sm:text-2xl",
                        "lg:pt-6 lg:text-3xl",
                      )}
                    >
                      {block.body}
                    </h3>
                  ) : (
                    <p
                      key={block.id}
                      className={cn(
                        "text-brand-muted text-lg leading-relaxed wrap-break-word whitespace-pre-line",
                        "lg:text-2xl",
                      )}
                    >
                      {block.body}
                    </p>
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {hasGallery && (
          <section
            id="project-gallery"
            aria-labelledby="project-gallery-title"
            className={cn(
              "flex scroll-mt-24 flex-col gap-6",
              "sm:gap-8",
              "lg:scroll-mt-32",
            )}
          >
            <h2
              id="project-gallery-title"
              className={cn(
                "font-display text-2xl font-semibold",
                "sm:text-3xl",
                "lg:text-4xl",
              )}
            >
              Галерея проекта
            </h2>

            <div
              className={cn(
                "grid grid-cols-1 gap-3",
                "sm:gap-4",
                "md:grid-cols-2",
                "lg:gap-6",
              )}
            >
              {galleryImages.map((image) => (
                <figure
                  key={image.id}
                  className={cn(
                    "flex min-w-0 items-center justify-center rounded-lg bg-[#EAE4DF] p-3",
                    "sm:p-4",
                    "lg:p-6",
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 767px) calc(100vw - 72px), (max-width: 1023px) 42vw, (max-width: 1359px) 40vw, 580px"
                    loading="lazy"
                    className={cn(
                      "block h-auto max-h-[75svh] w-auto max-w-full object-contain",
                      "sm:max-h-[80svh]",
                      "lg:max-h-[min(90svh,920px)]",
                    )}
                  />
                </figure>
              ))}
            </div>
          </section>
        )}
      </SiteContainer>
    </article>
  );
}

export default function ProjectPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="bg-brand-milk min-h-dvh" />}>
      <PublishedProject params={params} />
    </Suspense>
  );
}
