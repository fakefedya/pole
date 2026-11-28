import { Skeleton } from "@/components/ui/skeleton";
import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";

function Block({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Skeleton
      className={cn(
        "rounded-md motion-reduce:animate-none",
        light ? "bg-brand-charcoal/15" : "bg-brand-milk/10",
        className,
      )}
    />
  );
}

function Lines({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, index) => (
        <Block key={index} className={cn("h-4 w-full", index === count - 1 && "w-3/4")} />
      ))}
    </div>
  );
}

function SectionHeading() {
  return (
    <div className="flex max-w-full flex-col gap-4 lg:max-w-2/3">
      <Block className="h-9 w-3/4 max-w-96" />
      <Lines count={2} />
    </div>
  );
}

function PriceCard({ rows = 2 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-8 rounded-lg bg-neutral-900 p-5 lg:p-10">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex flex-col gap-4 border-b border-brand-milk/10 pb-6 last:border-0 last:pb-0">
          <Block className="h-6 w-3/5" />
          <Block className="h-9 w-2/5" />
          <Block className="h-16 w-full bg-brand-milk/5" />
        </div>
      ))}
    </div>
  );
}

export function FeaturedProjectsSkeleton() {
  return (
    <SiteSection className="min-h-dvh" role="status" aria-label="Загружаем проекты">
      <SiteContainer>
        <div aria-hidden="true" className="flex flex-col gap-8">
          <SectionHeading />
          <Block className="h-12 w-48 rounded-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[0, 1].map((index) => (
              <div key={index} className="overflow-hidden rounded-lg bg-neutral-900">
                <Block className="aspect-4/3 w-full rounded-none sm:aspect-3/2" />
                <div className="flex flex-col gap-4 p-5 lg:p-8">
                  <Block className="h-7 w-2/3" />
                  <Block className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}

export function IndividualSectionsSkeleton() {
  return (
    <div role="status" aria-label="Загружаем индивидуальные услуги">
      <SiteSection>
        <SiteContainer>
          <div aria-hidden="true" className="grid grid-cols-1 gap-4 rounded-lg bg-neutral-900 lg:grid-cols-2">
            {[0, 1].map((index) => (
              <div key={index} className="flex flex-col gap-8 p-5 lg:p-10">
                <div className="flex flex-col gap-5 border-b border-brand-milk/10 pb-8">
                  <Block className="h-9 w-3/4" />
                  <Lines />
                  <Block className="h-9 w-2/5" />
                  <Block className="h-12 w-44 rounded-full" />
                </div>
                <Block className="h-7 w-1/2" />
                <Lines count={5} />
                <Block className="h-16 w-full" />
                <Block className="h-12 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </SiteContainer>
      </SiteSection>
      <SiteSection>
        <SiteContainer>
          <div aria-hidden="true" className="flex flex-col gap-8">
            <SectionHeading />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="overflow-hidden rounded-lg bg-neutral-900">
                  <Block className="aspect-square w-full rounded-none" />
                  <div className="flex flex-col gap-4 p-5">
                    <Block className="h-6 w-2/3" />
                    <Lines count={3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SiteContainer>
      </SiteSection>
      <SiteSection>
        <SiteContainer>
          <div aria-hidden="true" className="flex flex-col gap-8">
            <SectionHeading />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[0, 1].map((index) => (
                <div key={index} className="flex flex-col gap-5 rounded-lg bg-neutral-900 p-5 lg:p-10">
                  <Block className="h-8 w-2/3" />
                  <Lines count={4} />
                  <Block className="h-9 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </SiteContainer>
      </SiteSection>
    </div>
  );
}

export function PricesSectionsSkeleton() {
  return (
    <div role="status" aria-label="Загружаем цены">
      {Array.from({ length: 5 }, (_, index) => (
        <SiteSection key={index}>
          <SiteContainer className="pt-24 pb-24 lg:pt-32 lg:pb-10">
            <div aria-hidden="true" className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-5">
                <Block className="h-9 w-3/4" />
                <Lines />
                {index !== 4 && <Block className="mt-3 h-12 w-48 rounded-full" />}
              </div>
              <PriceCard rows={index === 0 ? 4 : index === 2 ? 2 : 1} />
            </div>
          </SiteContainer>
        </SiteSection>
      ))}
    </div>
  );
}

export function ReadySectionsSkeleton() {
  return (
    <SiteSection role="status" aria-label="Загружаем готовые решения">
      <SiteContainer className="pt-5 pb-32 lg:pt-10 lg:pb-48">
        <div aria-hidden="true" className="flex flex-col gap-12 lg:gap-24">
          <div className="flex gap-2 rounded-full bg-neutral-900 p-1 w-fit">
            <Block className="h-12 w-40 rounded-full lg:h-16 lg:w-56" />
            <Block className="h-12 w-40 rounded-full lg:h-16 lg:w-56" />
          </div>
          <div className="flex flex-col gap-32">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <SectionHeading />
              <PriceCard rows={1} />
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {[0, 1].map((index) => (
                <div key={index} className="overflow-hidden rounded-md bg-neutral-900">
                  <Block className="aspect-3/2 w-full rounded-none" />
                  <div className="flex flex-col gap-4 p-5 lg:p-10">
                    <Block className="h-8 w-3/4" />
                    <Lines count={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}

export function ContactsInfoSkeleton() {
  return (
    <SiteSection role="status" aria-label="Загружаем контактную форму">
      <SiteContainer className="py-24 lg:py-32">
        <div aria-hidden="true" className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="flex flex-col gap-8 border-b border-brand-milk/15 pb-10 lg:col-span-5 lg:border-r lg:border-b-0 lg:pr-20 lg:pb-0">
            <Block className="h-9 w-48" />
            {[0, 1].map((index) => (
              <div key={index} className="flex flex-col gap-3">
                <Block className="h-4 w-28" />
                <Block className="h-6 w-52" />
              </div>
            ))}
            <Block className="mt-16 h-6 w-40" />
            {[0, 1].map((index) => <Block key={index} className="h-18 w-full max-w-80 rounded-lg" />)}
          </div>
          <div className="flex flex-col gap-8 pt-10 lg:col-span-7 lg:px-20 lg:pt-0">
            <Block className="h-9 w-64 max-w-full" />
            <div className="flex flex-col gap-5">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="flex flex-col gap-3">
                  <Block className="h-5 w-36" />
                  <Block className={cn("w-full rounded-lg", index === 2 ? "h-40" : "h-12")} />
                </div>
              ))}
              <Block className="h-5 w-3/4" />
              <Block className="h-12 w-48 rounded-full" />
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}

export function ProjectsIndexSkeleton() {
  return (
    <section className="bg-brand-black relative min-h-dvh w-full overflow-hidden" role="status" aria-label="Загружаем каталог проектов">
      <div aria-hidden="true" className="relative min-h-dvh w-full">
        <Block className="absolute inset-0 h-full w-full rounded-none bg-brand-milk/5" />
        <div className="absolute inset-x-0 top-0 px-5 pt-12 sm:px-9 lg:px-12">
          <Block className="h-12 w-3/5 max-w-xl lg:h-20" />
        </div>
        <Block className="absolute top-1/2 left-5 h-7 w-10 -translate-y-1/2 bg-brand-milk/15 sm:left-10" />
        <Block className="absolute top-1/2 right-5 h-7 w-10 -translate-y-1/2 bg-brand-milk/15 sm:right-10" />
        <div className="absolute right-5 bottom-16 flex gap-2 sm:right-8">
          <Block className="size-10 rounded-full" />
          <Block className="size-10 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <article className="min-h-dvh bg-brand-milk" role="status" aria-label="Загружаем проект">
      <SiteContainer className="mx-auto gap-12 lg:gap-20 xl:gap-24">
        <div aria-hidden="true" className="flex flex-col gap-12 lg:gap-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Block className="h-12 w-2/3 lg:h-16" light />
              <Block className="h-7 w-3/4" light />
            </div>
            <div className="flex max-w-lg flex-col gap-3">
              {[0, 1, 2].map((index) => <Block key={index} className="h-5 w-full" light />)}
            </div>
            <div className="flex flex-wrap gap-3">
              <Block className="h-12 w-48 rounded-full" light />
              <Block className="h-12 w-44 rounded-full" light />
            </div>
          </div>
          <Block className="aspect-4/3 w-full rounded-lg sm:aspect-3/2 xl:aspect-video" light />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Block className="h-9 w-1/2" light />
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3].map((index) => <Block key={index} className="h-5 w-full" light />)}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[0, 1].map((index) => <Block key={index} className="aspect-4/3 w-full rounded-lg" light />)}
          </div>
        </div>
      </SiteContainer>
    </article>
  );
}

export function SiteHeaderSkeleton() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-fit -translate-x-1/2 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-7.5">
      <div className="hidden items-center gap-2 rounded-full bg-brand-charcoal p-2 lg:flex">
        {[0, 1, 2, 3, 4].map((index) => <Block key={index} className="h-10 w-24 rounded-full" />)}
      </div>
      <div className="rounded-full bg-brand-charcoal p-2 lg:hidden">
        <Block className="h-12 w-44 rounded-full" />
      </div>
    </div>
  );
}
