import { cn } from "@/lib/utils";

type Props = {
  isWide?: boolean;
  isDefault?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function SiteContainer({
  children,
  isWide = false,
  isDefault = true,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "z-2 flex w-full flex-col",
        isWide ? "max-w-full" : "max-w-site",
        isDefault && "px-5 pt-24 pb-5 lg:px-10 lg:pt-48 lg:pb-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
