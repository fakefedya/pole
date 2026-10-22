import Link from 'next/link'
import { FolderKanban, LayoutDashboard, LockKeyhole, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { PERMISSION, hasPermission, primaryRoleLabel } from '@/lib/auth/authorization'

type Props = {
  email: string
  role: string | null | undefined
  children: React.ReactNode
}

export function DashboardShell({ email, role, children }: Props) {
  const items = [
    { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard, allowed: true },
    { href: '/dashboard/projects', label: 'Проекты', icon: FolderKanban,
      allowed: hasPermission(role, PERMISSION.PROJECT_READ) },
    { href: '/dashboard/security', label: 'Безопасность', icon: LockKeyhole, allowed: true },
  ]

  return (
    <div className="min-h-dvh bg-[#f6f4f0] text-neutral-950 md:grid md:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="border-b border-neutral-200 bg-white md:min-h-dvh md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-4 px-6 py-6">
          <Link href="/dashboard" className="text-xl font-semibold tracking-[-.05em]">POLE <span className="text-sm font-normal text-neutral-400">/ CMS</span></Link>
          <Badge variant="secondary">{primaryRoleLabel(role)}</Badge>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-col" aria-label="Навигация кабинета">
          {items.filter(item => item.allowed).map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800">
              <Icon className="size-4" aria-hidden="true" />{label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-neutral-100 px-6 py-5 md:mt-10">
          <p className="mb-1 truncate text-xs text-neutral-500">{email}</p>
          <div className="flex flex-wrap items-center gap-4"><LogoutButton />
            <Link className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:underline" href="/" target="_blank" rel="noopener noreferrer">На сайт <ArrowUpRight className="size-3" /></Link>
          </div>
        </div>
      </aside>
      <div className="min-w-0 px-5 py-8 sm:px-8 md:px-12 md:py-12">{children}</div>
    </div>
  )
}
