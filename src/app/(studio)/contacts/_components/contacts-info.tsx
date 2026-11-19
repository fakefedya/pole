import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";
import { contacts } from "./contacts";
import Image from "next/image";

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
              <div className="flex flex-col gap-y-8">
                {contacts
                  .filter((el) => el.type === "contact")
                  .map((el) => (
                    <div key={el.header} className="flex flex-col gap-y-2">
                      <span className="text-brand-muted">{el.header}</span>
                      <a
                        className="text-brand-milk group relative w-fit text-lg font-medium"
                        href={el.link.href}
                        target="_blank"
                      >
                        <span
                          className="absolute -bottom-1 left-0 h-px w-full bg-current/20"
                          aria-hidden="true"
                        >
                          <span className="group-hover:bg-brand-milk block size-full origin-left scale-x-0 bg-current transition-all duration-300 group-hover:scale-x-100"></span>
                        </span>
                        {el.link.label}
                      </a>
                    </div>
                  ))}
              </div>
              <div className="mt-16 flex flex-col gap-y-4">
                <h3 className="text-brand-milk">Следить за студией</h3>
                {contacts
                  .filter((el) => el.type === "social")
                  .map((el) => (
                    <a
                      key={el.header}
                      href={el.link.href}
                      className={cn(
                        "flex w-full max-w-80 items-center gap-x-4 rounded-lg bg-neutral-900 p-2 pl-4",
                        "transition-colors duration-300 hover:bg-neutral-800",
                      )}
                    >
                      {el.icon && (
                        <Image
                          src={`/social/${el.icon}`}
                          alt={el.icon}
                          width={48}
                          height={48}
                          className="stroke-white"
                        />
                      )}
                      <div className="flex flex-col gap-y-2 p-2">
                        <span className="text-brand-milk text-sm font-medium">
                          {el.header}
                        </span>
                        <span className="text-brand-muted text-sm font-medium">
                          {el.link.label}
                        </span>
                      </div>
                    </a>
                  ))}
              </div>
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
