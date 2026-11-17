import { Suspense } from "react";

import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { DashboardPageSkeleton } from "@/features/dashboard/components/dashboard-page-skeleton";
import { PriceEditor } from "@/features/prices/components/price-editor";
import { PRICE_CATALOG, type PriceCode } from "@/features/prices/config/price-catalog";
import { listDashboardPrices } from "@/features/prices/server/queries";
import { requirePagePermission } from "@/features/auth/server/access";
import { PERMISSION } from "@/lib/auth/authorization";

async function PricesContent() {
  await requirePagePermission(PERMISSION.PRICES_READ);
  const prices = await listDashboardPrices();
  const byCode = new Map(prices.map((item) => [item.code, item]));

  return (
    <main className="mx-auto w-full max-w-6xl space-y-7">
      <DashboardPageHeader
        title="Цены"
        description="Редактирование тарифов и управление публикацией на сайте"
      />
      <p className="text-sm text-muted-foreground">
        Значения из макета изначально скрыты. Отметьте «Опубликовано» для каждого
        проверенного тарифа и сохраните изменения. Изменение не затрагивает другие тарифы.
      </p>
      <div className="grid gap-4">
        {PRICE_CATALOG.map((definition) => {
          const price = byCode.get(definition.code);
          if (!price) {
            return (
              <p key={definition.code} role="alert" className="rounded-lg border border-red-400/50 p-4 text-red-300">
                Запись «{definition.title}» не найдена. Проверьте миграцию базы данных.
              </p>
            );
          }
          return (
            <PriceEditor
              key={`${definition.code}:${price.revision}`}
              price={{
                code: definition.code as PriceCode,
                title: definition.title,
                unit: definition.unit,
                amount: price.amount,
                isPublished: price.isPublished,
                revision: price.revision,
                updatedAt: price.updatedAt.toISOString(),
              }}
            />
          );
        })}
      </div>
    </main>
  );
}

export default function DashboardPricesPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton variant="form" />}>
      <PricesContent />
    </Suspense>
  );
}
