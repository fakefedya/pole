"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice, type PriceCode, type PriceUnit } from "@/features/prices/config/price-catalog";
import {
  savePriceAction,
  type PriceActionState,
} from "@/features/prices/server/actions";

export type PriceEditorData = {
  code: PriceCode;
  title: string;
  unit: PriceUnit;
  amount: number;
  isPublished: boolean;
  revision: number;
  updatedAt: string;
};

export function PriceEditor({ price }: { price: PriceEditorData }) {
  const router = useRouter();
  const initial: PriceActionState = { error: null, revision: price.revision };
  const [state, formAction, pending] = useActionState(savePriceAction, initial);

  useEffect(() => {
    if (state.savedAt) {
      toast.success(`Тариф «${price.title}» сохранён.`);
      router.refresh();
    }
  }, [state.savedAt, router, price.title]);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-dashboard-border bg-dashboard-input p-5 text-brand-milk"
    >
      <input type="hidden" name="code" value={price.code} />
      <input type="hidden" name="expectedRevision" value={state.revision} />
      <div className={cn("grid gap-4", "lg:grid-cols-[minmax(0,1fr)_minmax(12rem,15rem)_auto] lg:items-end")}>
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold">{price.title}</h2>
          <p className="text-sm text-muted-foreground">
            Сейчас: {formatPrice(price.amount, price.unit)}
          </p>
          <p className="text-xs text-muted-foreground">
            Изменено: {new Date(price.updatedAt).toLocaleString("ru-RU")}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor={`amount-${price.code}`} className="block text-sm font-medium">
            {price.unit === "PERCENT_PURCHASES" ? "Процент" : "Сумма, ₽"}
          </label>
          <input
            id={`amount-${price.code}`}
            name="amount"
            type="number"
            inputMode="numeric"
            min={1}
            max={price.unit === "PERCENT_PURCHASES" ? 100 : 10_000_000}
            step={1}
            defaultValue={price.amount}
            required
            aria-invalid={Boolean(state.fieldErrors?.amount)}
            aria-describedby={state.fieldErrors?.amount ? `price-error-${price.code}` : undefined}
            className="h-11 w-full rounded-lg border border-dashboard-input-border bg-dashboard-background px-3 text-base text-brand-milk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracota-accent"
          />
          {state.fieldErrors?.amount && (
            <p id={`price-error-${price.code}`} className="text-sm text-red-400">
              {state.fieldErrors.amount}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-3">
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={price.isPublished}
              className="size-4 accent-[#b1562a]"
            />
            Опубликовано
          </label>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 min-w-36 items-center justify-center gap-2 rounded-lg border border-brand-terracota-accent bg-brand-terracota-accent px-4 text-sm font-medium text-white transition hover:bg-brand-terracota disabled:cursor-wait disabled:opacity-50"
          >
            <Save className="size-4" aria-hidden="true" />
            {pending ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </div>
      {state.error && <p role="alert" className="mt-3 text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
