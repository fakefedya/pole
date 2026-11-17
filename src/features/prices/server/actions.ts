"use server";

import { revalidatePath, updateTag } from "next/cache";
import { assertMutationPermission } from "@/features/auth/server/access";
import { PERMISSION } from "@/lib/auth/authorization";
import { prisma } from "@/lib/db/prisma";
import { fieldErrorsFromZod } from "@/features/dashboard/lib/form-errors";
import { savePriceSchema } from "@/features/prices/schemas/service-price";

export type PriceActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
  savedAt?: number;
  revision: number;
};

export async function savePriceAction(
  previous: PriceActionState,
  formData: FormData,
): Promise<PriceActionState> {
  // A hidden route or client-side UI check is not an authorization boundary.
  const session = await assertMutationPermission(PERMISSION.PRICES_UPDATE);

  const result = savePriceSchema.safeParse({
    code: formData.get("code"),
    amount: formData.get("amount"),
    expectedRevision: formData.get("expectedRevision"),
    isPublished: formData.get("isPublished") ?? undefined,
  });
  if (!result.success) {
    return {
      error: "Проверьте данные тарифа.",
      fieldErrors: fieldErrorsFromZod(result.error),
      revision: previous.revision,
    };
  }

  const { code, amount, expectedRevision } = result.data;
  const isPublished = result.data.isPublished === "on";

  try {
    const outcome = await prisma.$transaction(async (tx) => {
      const current = await tx.servicePrice.findUnique({
        where: { code },
        select: { amount: true, isPublished: true, revision: true },
      });

      if (!current) return { status: "MISSING" as const };
      if (current.revision !== expectedRevision)
        return { status: "STALE" as const };

      if (current.amount === amount && current.isPublished === isPublished) {
        return { status: "UNCHANGED" as const, revision: current.revision };
      }

      // Atomic compare-and-swap: no silent overwrite from a second browser tab.
      const updated = await tx.servicePrice.updateMany({
        where: { code, revision: expectedRevision },
        data: {
          amount,
          isPublished,
          revision: { increment: 1 },
          updatedById: session.user.id,
        },
      });
      if (updated.count !== 1) return { status: "STALE" as const };

      await tx.servicePriceChange.create({
        data: {
          code,
          actorId: session.user.id,
          previousAmount: current.amount,
          nextAmount: amount,
          previousPublished: current.isPublished,
          nextPublished: isPublished,
        },
      });
      return { status: "SAVED" as const, revision: expectedRevision + 1 };
    });

    if (outcome.status === "MISSING") {
      return { error: "Тариф не найден. Проверьте миграции базы данных.", revision: previous.revision };
    }
    if (outcome.status === "STALE") {
      return {
        error: "Тариф уже изменён в другой вкладке. Обновите страницу перед сохранением.",
        revision: previous.revision,
      };
    }

    if (outcome.status === "SAVED") {
      updateTag("service-prices");
      revalidatePath("/prices");
      revalidatePath("/dashboard/prices");
    }
    return { error: null, revision: outcome.revision, savedAt: Date.now() };
  } catch (error) {
    console.error("Price update failed", error);
    return {
      error: "Не удалось сохранить тариф. Повторите попытку позднее.",
      revision: previous.revision,
    };
  }
}
