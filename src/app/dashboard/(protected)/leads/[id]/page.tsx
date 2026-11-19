import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requirePagePermission } from "@/features/auth/server/access";
import { PERMISSION } from "@/lib/auth/authorization";
import { DashboardPageSkeleton } from "@/features/dashboard/components/dashboard-page-skeleton";
import { getDashboardLead } from "@/features/contacts/server/queries";
import { contactMethodLabel, contactStatusLabel } from "@/features/contacts/config/contact-labels";
import { LeadStatusEditor } from "@/features/contacts/components/lead-status-editor";
import { LeadEmailRetry } from "@/features/contacts/components/lead-email-retry";

type Params = { id: string };

async function LeadDetails({ params }: { params: Promise<Params> }) {
  await requirePagePermission(PERMISSION.LEADS_READ);
  const { id } = await params;
  if (!/^c[a-z0-9]{10,32}$/.test(id)) notFound();
  const lead = await getDashboardLead(id);
  if (!lead) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 text-brand-milk">
      <Link href="/dashboard/leads" className="text-sm text-brand-neutral underline">← К заявкам</Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Заявка #{lead.shortCode}</h1>
        <p className="text-brand-milk">От {lead.name}</p>
        <p className="text-sm text-brand-neutral">Получена {lead.createdAt.toLocaleString("ru-RU")}</p>
      </div>
      <section className="space-y-5 rounded-xl border border-dashboard-border bg-dashboard-input p-6">
        <h2 className="text-xl font-semibold">Обращение</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-sm text-brand-neutral">Услуга</dt><dd className="mt-1">{lead.category.name}</dd></div>
          <div><dt className="text-sm text-brand-neutral">Предпочтительный канал</dt><dd className="mt-1">{contactMethodLabel(lead.contactMethod)}</dd></div>
          <div><dt className="text-sm text-brand-neutral">Почта</dt><dd className="mt-1 break-all"><a href={`mailto:${lead.email}`} className="underline">{lead.email}</a></dd></div>
          <div><dt className="text-sm text-brand-neutral">Телефон</dt><dd className="mt-1"><a href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`} className="underline">{lead.phone}</a></dd></div>
        </dl>
        <div className="border-t border-dashboard-border pt-4">
          <h3 className="text-sm text-brand-neutral">Сообщение</h3>
          <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">{lead.message}</p>
        </div>
      </section>
      <section className="rounded-xl border border-dashboard-border p-6">
        <LeadStatusEditor id={lead.id} status={lead.status} revision={lead.revision} />
        {lead.statusChanges.length > 0 && (
          <div className="mt-6 border-t border-dashboard-border pt-4">
            <h3 className="text-sm font-medium">История статусов</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-neutral">
              {lead.statusChanges.map((change) => (
                <li key={change.id}>{change.createdAt.toLocaleString("ru-RU")}: {contactStatusLabel(change.previous)} → {contactStatusLabel(change.next)}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <section className="space-y-4 rounded-xl border border-dashboard-border p-6">
        <h2 className="text-xl font-semibold">Email-уведомления</h2>
        {lead.mailJobs.map((job) => (
          <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border pt-4">
            <div>
              <p className="font-medium">{job.recipient === "STUDIO" ? "Письмо студии" : "Подтверждение клиенту"}</p>
              <p className="text-sm text-brand-neutral">{job.status === "SENT" ? "Отправлено" : job.status === "FAILED" ? "Ошибка отправки" : job.status === "SENDING" ? "Отправляется" : "Ожидает отправки"}</p>
              {job.sentAt && <p className="text-xs text-brand-neutral">{job.sentAt.toLocaleString("ru-RU")}</p>}
            </div>
            {job.status !== "SENT" && <LeadEmailRetry jobId={job.id} />}
          </div>
        ))}
      </section>
    </main>
  );
}

export default function DashboardLeadDetailsPage({ params }: { params: Promise<Params> }) {
  return <Suspense fallback={<DashboardPageSkeleton variant="form" />}><LeadDetails params={params} /></Suspense>;
}
