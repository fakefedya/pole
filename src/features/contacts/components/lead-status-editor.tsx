"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { CONTACT_STATUSES, type ContactStatus } from "@/features/contacts/config/contact-labels";
import { updateContactLeadStatusAction } from "@/features/contacts/server/actions";

export function LeadStatusEditor({ id, status, revision }: {
  id: string; status: ContactStatus; revision: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState<ContactStatus>(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <label htmlFor="lead-status" className="block text-sm font-medium text-brand-milk">Статус заявки</label>
      <div className="flex flex-wrap gap-3">
        <select
          id="lead-status" value={value} disabled={pending}
          onChange={(event) => setValue(event.target.value as ContactStatus)}
          className="min-h-11 rounded-lg border border-dashboard-input-border bg-dashboard-input px-4 text-brand-milk"
        >
          {CONTACT_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button
          type="button" disabled={pending || value === status}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await updateContactLeadStatusAction({ id, status: value, revision });
              if (result.ok) router.refresh();
              else setError(result.error ?? "Не удалось изменить статус.");
            });
          }}
          className="min-h-11 rounded-lg bg-brand-terracota-accent px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Сохраняем…" : "Сохранить статус"}
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
