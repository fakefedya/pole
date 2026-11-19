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
      <SiteContainer className={cn("relative z-2 px-5 pb-24", "sm:px-8 sm:pb-28", "lg:px-10 lg:pb-36")}>
        <div className={cn("grid min-w-0 grid-cols-1 gap-12", "md:gap-16", "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-0")}>
          <div className={cn("min-w-0 border-b border-brand-milk/15 pb-12", "lg:border-b-0 lg:border-r lg:pr-10 lg:pb-0", "xl:pr-16")}>
            <h2 className={cn("font-display text-2xl font-semibold text-brand-milk", "md:text-3xl")}>
              Напишите нам
            </h2>
            <div className="mt-8 space-y-7">
              {contacts.filter((item) => item.type === "contact").map((item) => (
                <div key={item.header} className="space-y-2">
                  <p className="text-sm text-brand-muted">{item.header}</p>
                  <a className="text-base font-medium text-brand-milk underline decoration-white/20 underline-offset-8 transition-colors hover:decoration-white sm:text-lg" href={item.link.href}>
                    {item.link.label}
                  </a>
                </div>
              ))}
            </div>
            <div className={cn("mt-12", "lg:mt-20")}>
              <h3 className="text-base font-medium text-brand-milk">Следить за студией</h3>
              <div className="mt-5 flex flex-col gap-3">
                {contacts.filter((item) => item.type === "social").map((item) => (
                  <a
                    key={item.header}
                    href={item.link.href}
                    target="_blank" rel="noopener noreferrer"
                    className={cn(
                      "flex w-full max-w-80 items-center gap-3 rounded-lg bg-neutral-900 p-3",
                      "transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-brand-milk",
                    )}
                  >
                    {item.icon && (
                      <Image src={`/social/${item.icon}`} alt="" width={40} height={40} />
                    )}
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-sm font-medium text-brand-milk">{item.header}</span>
                      <span className="text-sm text-brand-muted">{item.link.label}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className={cn("min-w-0", "lg:pl-10", "xl:pl-16")}>
            <h2 className={cn("font-display text-2xl font-semibold text-brand-milk", "md:text-3xl")}>
              Или оставьте сообщение
            </h2>
            <div className="mt-8 sm:mt-10"><ContactsForm categories={categories} /></div>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
