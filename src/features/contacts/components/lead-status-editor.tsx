"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  CONTACT_STATUSES,
  type ContactStatus,
} from "@/features/contacts/config/contact-labels";
import { updateContactLeadStatusAction } from "@/features/contacts/server/actions";

export function LeadStatusEditor({
  id,
  status,
  revision,
}: {
  id: string;
  status: ContactStatus;
  revision: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState<ContactStatus>(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <label
        htmlFor="lead-status"
        className="text-brand-milk block text-sm font-medium"
      >
        Статус заявки
      </label>
      <div className="flex flex-wrap gap-3">
        <select
          id="lead-status"
          value={value}
          disabled={pending}
          onChange={(event) => setValue(event.target.value as ContactStatus)}
          className="border-dashboard-input-border bg-dashboard-input text-brand-milk min-h-11 rounded-lg border px-4"
        >
          {CONTACT_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={pending || value === status}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await updateContactLeadStatusAction({
                id,
                status: value,
                revision,
              });
              if (result.ok) router.refresh();
              else setError(result.error ?? "Не удалось изменить статус.");
            });
          }}
          className="bg-brand-terracota-accent min-h-11 rounded-lg px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Сохраняем…" : "Сохранить статус"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-[#f33]">
          {error}
        </p>
      )}
    </div>
  );
}
