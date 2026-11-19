"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { retryContactEmailAction } from "@/features/contacts/server/actions";

export function LeadEmailRetry({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button" disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await retryContactEmailAction(jobId);
            if (result.ok) router.refresh();
            else setError(result.error ?? "Не удалось отправить.");
          });
        }}
        className="rounded-lg border border-dashboard-input-border bg-dashboard-input px-3 py-2 text-sm text-brand-milk disabled:opacity-50"
      >
        {pending ? "Отправка…" : "Повторить отправку"}
      </button>
      {error && <span role="alert" className="text-sm text-red-400">{error}</span>}
    </span>
  );
}
