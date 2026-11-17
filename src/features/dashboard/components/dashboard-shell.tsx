import Link from "next/link";
import {
  FolderKanban,
  LayoutDashboard,
  ArrowUpRight,
  UsersRound,
  Tags,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/features/auth/components/logout-button";
import {
  PERMISSION,
  hasPermission,
  primaryRoleLabel,
} from "@/lib/auth/authorization";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  role: string | null | undefined;
  children: React.ReactNode;
};

export function DashboardShell({ name, role, children }: Props) {
  const items = [
    {
      href: "/dashboard",
      label: "Обзор",
      icon: LayoutDashboard,
      allowed: true,
    },
    {
      href: "/dashboard/projects",
      label: "Проекты",
      icon: FolderKanban,
      allowed: hasPermission(role, PERMISSION.PROJECT_READ),
    },
    {
      href: "/dashboard/prices",
      label: "Цены",
      icon: Tags,
      allowed: hasPermission(role, PERMISSION.PRICES_READ),
    },
    {
      href: "/dashboard/users",
      label: "Пользователи",
      icon: UsersRound,
      allowed: hasPermission(role, PERMISSION.USERS_MANAGE),
    },
  ];

  return (
    <div
      className={cn(
        "bg-dashboard-background min-h-dvh",
        "md:grid md:grid-cols-[124px_minmax(0,1fr)]",
      )}
    >
      <aside className="sticky top-0 mx-7.5 flex h-dvh items-center">
        <nav
          className="bg-brand-charcoal relative flex w-fit flex-col rounded-full p-1.5 backdrop-blur-md"
          aria-label="Навигация дашборда"
        >
          {items
            .filter((item) => item.allowed)
            .map(({ href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-brand-milk h-fit w-fit rounded-full p-4",
                  "hover:bg-brand-milk/10 transition-colors duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800",
                )}
              >
                <Icon size={20} aria-hidden="true" />
              </Link>
            ))}
        </nav>
      </aside>

      <div className="min-w-0 p-7.5">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="flex items-center justify-end gap-2">
            <div className="border-chart-5 flex h-13 items-center gap-2 rounded-full border p-1.5">
              <p className="text-brand-milk px-5 text-sm font-medium">{name}</p>
              <Badge
                variant="secondary"
                className="text-brand-charcoal h-full px-5 text-sm font-medium"
              >
                {primaryRoleLabel(role)}
              </Badge>
            </div>
            <LogoutButton />
            <Link
              className={cn(
                "bg-brand-charcoal text-brand-milk flex items-center rounded-full p-4",
                "hover:bg-brand-milk/10 transition-colors duration-300",
              )}
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowUpRight size={20} />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
