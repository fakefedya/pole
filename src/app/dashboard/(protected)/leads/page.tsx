import { Suspense } from "react";
import Link from "next/link";

import { requirePagePermission } from "@/features/auth/server/access";
import { PERMISSION } from "@/lib/auth/authorization";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { DashboardPageSkeleton } from "@/features/dashboard/components/dashboard-page-skeleton";
import { CONTACT_STATUSES, contactStatusLabel, contactMethodLabel } from "@/features/contacts/config/contact-labels";
import { listDashboardContactCategories, listDashboardLeads } from "@/features/contacts/server/queries";
import { cn } from "@/lib/utils";

type Params = { status?: string; category?: string; page?: string };

async function LeadsContent({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePagePermission(PERMISSION.LEADS_READ);
  const params = await searchParams;
  const categories = await listDashboardContactCategories();
  const status = CONTACT_STATUSES.find((entry) => entry.value === params.status)?.value;
  const categoryCode = categories.find((entry) => entry.code === params.category)?.code;
  const page = typeof params.page === "string" && /^[1-9]\d{0,3}$/.test(params.page)
    ? Number(params.page) : 1;
  const { rows: leads, total, pageSize } = await listDashboardLeads({ status, categoryCode, page });
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageHref = (next: number) => {
    const search = new URLSearchParams();
    if (status) search.set("status", status);
    if (categoryCode) search.set("category", categoryCode);
    search.set("page", String(next));
    return `/dashboard/leads?${search.toString()}`;
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7">
      <DashboardPageHeader title="Заявки" description="Обращения посетителей сайта" />
      <form method="get" className="flex flex-wrap gap-3">
        <label className="flex min-w-40 flex-col gap-2 text-sm text-brand-milk">
          Статус
          <select name="status" defaultValue={status ?? ""} className="h-11 rounded-lg border border-dashboard-input-border bg-dashboard-input px-3">
            <option value="">Все статусы</option>
            {CONTACT_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="flex min-w-48 flex-col gap-2 text-sm text-brand-milk">
          Направление
          <select name="category" defaultValue={categoryCode ?? ""} className="h-11 rounded-lg border border-dashboard-input-border bg-dashboard-input px-3">
            <option value="">Все услуги</option>
            {categories.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
          </select>
        </label>
        <button type="submit" className="mt-auto h-11 rounded-lg bg-brand-terracota-accent px-5 text-sm font-medium text-white">Показать</button>
        <Link href="/dashboard/leads" className="mt-auto inline-flex h-11 items-center px-3 text-sm text-brand-neutral underline">Сбросить</Link>
      </form>

      <div className="overflow-x-auto rounded-xl border border-dashboard-border">
        <table className="w-full min-w-175 text-left text-sm text-brand-milk">
          <thead className="bg-dashboard-input text-brand-neutral">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 font-medium">Клиент</th>
              <th className="px-4 py-3 font-medium">Направление</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Уведомления</th>
              <th className="px-4 py-3 font-medium">Действие</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const sentCount = lead.mailJobs.filter((job) => job.status === "SENT").length;
              return (
                <tr key={lead.id} className="border-t border-dashboard-border hover:bg-dashboard-input/40">
                  <td className="px-4 py-4 font-mono font-semibold tracking-wider whitespace-nowrap">
                    <Link className="hover:text-brand-terracota-accent" href={`/dashboard/leads/${lead.id}`}>#{lead.shortCode}</Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{lead.createdAt.toLocaleString("ru-RU")}</td>
                  <td className="px-4 py-4">
                    <strong className="font-medium">{lead.name}</strong>
                    <div className="mt-1 text-xs text-brand-neutral">{contactMethodLabel(lead.contactMethod)}</div>
                  </td>
                  <td className="px-4 py-4">{lead.category.name}</td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                      lead.status === "NEW" && "border-amber-500/30 text-amber-300",
                      lead.status === "IN_PROGRESS" && "border-sky-500/30 text-sky-300",
                      lead.status === "CLOSED" && "border-white/20 text-brand-neutral",
                    )}>{contactStatusLabel(lead.status)}</span>
                  </td>
                  <td className="px-4 py-4">{sentCount} / 2</td>
                  <td className="px-4 py-4"><Link className="underline underline-offset-4 hover:text-brand-terracota-accent" href={`/dashboard/leads/${lead.id}`}>Открыть</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!leads.length && <p className="p-8 text-center text-brand-neutral">Заявок не найдено.</p>}
      </div>
      <nav aria-label="Страницы заявок" className="flex items-center justify-between gap-4 text-sm text-brand-neutral">
        <span>{total === 0 ? "Заявок нет" : `Страница ${page} из ${pages} · всего ${total}`}</span>
        <span className="flex gap-3">
          {page > 1 && <Link href={pageHref(page - 1)} className="underline underline-offset-4">Назад</Link>}
          {page < pages && <Link href={pageHref(page + 1)} className="underline underline-offset-4">Вперёд</Link>}
        </span>
      </nav>
    </main>
  );
}

export default function DashboardLeadsPage({ searchParams }: { searchParams: Promise<Params> }) {
  return <Suspense fallback={<DashboardPageSkeleton variant="table" />}><LeadsContent searchParams={searchParams} /></Suspense>;
}
