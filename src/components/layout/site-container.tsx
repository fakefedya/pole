import { cn } from "@/lib/utils";

type Props = {
  isWide?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function SiteContainer({ children, isWide = false, className }: Props) {
  return (
    <div
      className={cn(
        "flex w-full flex-col",
        isWide ? "max-w-full" : "max-w-site",
        className,
      )}
    >
      {children}
    </div>
  );
}
