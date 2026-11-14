import { cn } from "@/lib/utils";
import { SiteContainer } from "./site-container";
import { SiteSection } from "./site-section";
import Link from "next/link";

type Props = {
  title: string;
  subtitle: string;
  buttonText: string;
  className?: string;
};

export function CTA({ title, subtitle, buttonText, className }: Props) {
  return (
    <SiteSection>
      <SiteContainer
        className={cn("z-2 px-5 pt-35 pb-20", "lg:px-10 lg:pt-40")}
      >
        <div className={cn("w-full rounded-full p-10", className)}>
          <div className="flex flex-col gap-y-8">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <div className="flex items-center">
            <Link href={"/about"}>{buttonText}</Link>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
