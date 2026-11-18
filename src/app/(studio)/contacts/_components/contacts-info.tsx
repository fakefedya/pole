import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";

export function ContactsInfoSection() {
  return (
    <SiteSection>
      <SiteContainer className={cn("z-2 p-5", "lg:p-10")}>
        <div className="grid grid-cols-12">
          <div
            className={cn(
              "border-brand-milk/15 col-span-12",
              "lg:col-span-5 lg:border-r lg:pr-20",
            )}
          >
            <div className="flex flex-col gap-y-8">
              <h2
                className={cn(
                  "text-brand-milk font-display text-2xl font-semibold",
                  "lg:text-3xl",
                )}
              >
                Напишите нам
              </h2>
            </div>
          </div>
          <div className={cn("col-span-12", "lg:col-span-7 lg:px-20")}>
            <div className="flex flex-col gap-y-8">
              <h2
                className={cn(
                  "text-brand-milk font-display text-2xl font-semibold",
                  "lg:text-3xl",
                )}
              >
                Или оставьте сообщение
              </h2>
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
