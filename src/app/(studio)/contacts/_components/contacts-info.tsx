import Image from "next/image";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { listPublicContactCategories } from "@/features/contacts/server/queries";
import { cn } from "@/lib/utils";
import { ContactsForm } from "./contacts-form";
import { contacts } from "./contacts";

export async function ContactsInfoSection() {
  const categories = await listPublicContactCategories();

  return (
    <SiteSection>
      <SiteContainer className={cn("px-5 pb-20", "lg:p-10")}>
        <div className={cn("grid w-full grid-cols-12")}>
          <div
            className={cn(
              "border-brand-milk/15 col-span-12 min-w-0 border-b pb-10",
              "lg:col-span-5 lg:border-r lg:border-b-0 lg:pr-20 lg:pb-0",
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
                  .filter((item) => item.type === "contact")
                  .map((item) => (
                    <div key={item.header} className="flex flex-col gap-y-2">
                      <p className="text-brand-muted">{item.header}</p>
                      <a
                        className="text-brand-milk group relative w-fit text-lg font-medium"
                        href={item.link.href}
                      >
                        <span
                          className="absolute -bottom-2 left-0 h-px w-full bg-current/20"
                          aria-hidden="true"
                        >
                          <span className="group-hover:bg-brand-milk block size-full origin-left scale-x-0 bg-current transition-all duration-300 group-hover:scale-x-100"></span>
                        </span>
                        {item.link.label}
                      </a>
                    </div>
                  ))}
              </div>
              <div className="mt-16 flex flex-col gap-y-4">
                <h3 className="text-brand-milk font-medium">
                  Следить за студией
                </h3>
                <div className="mt-5 flex flex-col gap-3">
                  {contacts
                    .filter((item) => item.type === "social")
                    .map((item) => (
                      <a
                        key={item.header}
                        href={item.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex w-full max-w-80 items-center gap-x-4 rounded-lg bg-neutral-900 p-2 pl-4",
                          "transition-colors duration-300 hover:bg-neutral-800",
                        )}
                      >
                        {item.icon && (
                          <Image
                            src={`/social/${item.icon}`}
                            alt=""
                            width={40}
                            height={40}
                          />
                        )}
                        <span className="flex flex-col gap-y-2 p-2">
                          <span className="text-brand-milk text-sm font-medium">
                            {item.header}
                          </span>
                          <span className="text-brand-muted text-sm font-medium">
                            {item.link.label}
                          </span>
                        </span>
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "col-span-12 min-w-0 pt-10",
              "lg:col-span-7 lg:px-20 lg:pt-0",
            )}
          >
            <div className="flex flex-col gap-y-8">
              <h2
                className={cn(
                  "font-display text-brand-milk text-2xl font-semibold",
                  "md:text-3xl",
                )}
              >
                Или оставьте сообщение
              </h2>
              <ContactsForm categories={categories} />
            </div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
