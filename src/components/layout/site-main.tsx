import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function SiteMain({ children, className }: Props) {
  return (
    <main className={cn("bg-brand-black z-3 min-h-full", className)}>
      {children}
    </main>
  );
}
