import { cn } from "@/lib/utils";
import { SiteContainer } from "./site-container";
import { SiteSection } from "./site-section";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Send } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  buttonText: string;
  ctaBg?: string;
  sectionBg?: string;
};

export function CTASection({
  title,
  subtitle,
  buttonText,
  ctaBg,
  sectionBg,
}: Props) {
  return (
    <SiteSection className={sectionBg}>
      <SiteContainer className={cn("z-2 p-0", "lg:px-10 lg:py-48")}>
        <div
          className={cn(
            "flex w-full flex-col items-center gap-y-4 px-5 py-32",
            "lg:flex-row lg:justify-between lg:rounded-full lg:px-20 lg:py-15",
            ctaBg,
          )}
        >
          <div className={cn("flex w-full flex-col gap-y-4", "lg:max-w-2/3")}>
            <h3
              className={cn(
                "text-brand-milk font-display text-2xl leading-[1.2] font-semibold whitespace-pre-line uppercase",
                "lg:text-3xl",
              )}
            >
              {title}
            </h3>
            <p className={cn("text-brand-milk text-xl", "lg:text-2xl")}>
              {subtitle}
            </p>
          </div>
          <div className={cn("flex w-full items-center", "lg:w-fit")}>
            <Link
              href="/contacts"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "flex h-12 w-fit items-center gap-2 rounded-full px-5 text-sm",
                "bg-brand-milk/5 text-brand-milk border-brand-milk/50 border",
                "hover:bg-brand-milk/15 transition-colors duration-300",
                "lg:h-fit lg:px-10 lg:py-5 lg:text-base",
              )}
            >
              {buttonText}
              <Send className={cn("h-4 w-4", "lg:h-5 lg:w-5")} />
            </Link>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
