"use server";

import { createHmac } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { env } from "@/env";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { PERMISSION } from "@/lib/auth/authorization";
import { assertMutationPermission } from "@/features/auth/server/access";
import { contactLeadSchema, contactLeadStatusSchema, normalizeRussianPhone, type ContactLeadData } from "@/features/contacts/schemas/contact-lead";
import { deliverContactMailJob } from "@/features/contacts/server/mail";
import { createLeadShortCode, isLeadShortCodeConflict } from "@/features/contacts/server/short-code";

export type CreateContactLeadResult =
  | { ok: true; shortCode?: string }
  | { ok: false; code: "INVALID" | "RATE_LIMIT" | "FAILED"; fieldErrors?: Record<string, string> };

const fingerprint = (value: string) =>
  createHmac("sha256", env.AUTH_SECRET).update(value).digest("hex");

/** DB-backed atomic window. Email + phone each permit 3 requests / hour. */
async function countSubmission(tx: Prisma.TransactionClient, key: string) {
  const rows = await tx.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "ContactLeadThrottle" ("key", "windowStart", "count")
    VALUES (${key}, CURRENT_TIMESTAMP, 1)
    ON CONFLICT ("key") DO UPDATE
    SET "count" = CASE
          WHEN "ContactLeadThrottle"."windowStart" <= CURRENT_TIMESTAMP - INTERVAL '1 hour'
          THEN 1 ELSE "ContactLeadThrottle"."count" + 1 END,
        "windowStart" = CASE
          WHEN "ContactLeadThrottle"."windowStart" <= CURRENT_TIMESTAMP - INTERVAL '1 hour'
          THEN CURRENT_TIMESTAMP ELSE "ContactLeadThrottle"."windowStart" END
    RETURNING "count";
  `;
  return rows[0]?.count ?? 999;
}

/** Retry the complete transaction: PostgreSQL rolls back throttle increments on conflict. */
async function persistLead(data: ContactLeadData, email: string, phone: string) {
  const maxAttempts = 12;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const category = await tx.contactServiceCategory.findUnique({
          where: { code: data.categoryCode }, select: { isActive: true },
        });
        if (!category?.isActive) return { kind: "INVALID_CATEGORY" as const };

        const phoneDigits = phone.replace(/\D/g, "");
        const emailCount = await countSubmission(tx, fingerprint(`email:${email}`));
        const phoneCount = await countSubmission(tx, fingerprint(`phone:${phoneDigits}`));
        if (emailCount > 3 || phoneCount > 3) return { kind: "RATE_LIMIT" as const };

        const last = await tx.contactLead.findFirst({
          where: {
            email, phone, categoryCode: data.categoryCode, message: data.message,
            createdAt: { gte: new Date(Date.now() - 90_000) },
          },
          select: { id: true },
        });
        if (last) return { kind: "DUPLICATE" as const };

        const lead = await tx.contactLead.create({
          data: {
            shortCode: createLeadShortCode(),
            name: data.name, categoryCode: data.categoryCode, message: data.message,
            contactMethod: data.contactMethod, email, phone,
            mailJobs: { create: [{ recipient: "STUDIO" }, { recipient: "CLIENT" }] },
          },
          select: { shortCode: true, mailJobs: { select: { id: true } } },
        });
        return {
          kind: "CREATED" as const,
          shortCode: lead.shortCode,
          jobIds: lead.mailJobs.map((job) => job.id),
        };
      }, { timeout: 10_000 });
    } catch (error) {
      if (isLeadShortCodeConflict(error) && attempt < maxAttempts - 1) continue;
      throw error;
    }
  }
  throw new Error("Could not allocate a unique four-character lead reference");
}

export async function createContactLeadAction(input: unknown): Promise<CreateContactLeadResult> {
  const result = contactLeadSchema.safeParse(input);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? "");
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, code: "INVALID", fieldErrors };
  }

  const data = result.data;
  // A filled honeypot must never result in a saved lead or an outbound email.
  if (data.website?.trim()) return { ok: true };

  const email = data.email.trim().toLowerCase();
  const phone = normalizeRussianPhone(data.phone);

  try {
    const outcome = await persistLead(data, email, phone);

    if (outcome.kind === "INVALID_CATEGORY")
      return { ok: false, code: "INVALID", fieldErrors: { categoryCode: "Услуга недоступна. Обновите страницу." } };
    if (outcome.kind === "RATE_LIMIT") return { ok: false, code: "RATE_LIMIT" };
    if (outcome.kind === "CREATED") {
      // Persist first, then attempt both emails. An SMTP outage never loses the lead.
      await Promise.allSettled(outcome.jobIds.map((id) => deliverContactMailJob(id)));
      revalidatePath("/dashboard/leads");
      return { ok: true, shortCode: outcome.shortCode };
    }
    return { ok: true };
  } catch (error) {
    console.error("Contact lead submission failed", error instanceof Error ? error.name : "UNKNOWN");
    return { ok: false, code: "FAILED" };
  }
}

export type ContactLeadStatusResult = { ok: boolean; error?: string };

export async function updateContactLeadStatusAction(input: unknown): Promise<ContactLeadStatusResult> {
  const session = await assertMutationPermission(PERMISSION.LEADS_UPDATE);
  const parsed = contactLeadStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Некорректные данные." };
  const { id, status, revision } = parsed.data;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.contactLead.findUnique({
        where: { id }, select: { status: true, revision: true },
      });
      if (!existing || existing.revision !== revision) return false;
      if (existing.status === status) return true;

      const outcome = await tx.contactLead.updateMany({
        where: { id, revision },
        data: { status, revision: { increment: 1 } },
      });
      if (outcome.count !== 1) return false;
      await tx.contactLeadStatusChange.create({
        data: { leadId: id, actorId: session.user.id, previous: existing.status, next: status },
      });
      return true;
    });
    if (!updated) return { ok: false, error: "Заявка уже изменена. Обновите страницу." };
    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${id}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "Не удалось сохранить статус." };
  }
}

export async function retryContactEmailAction(input: unknown): Promise<ContactLeadStatusResult> {
  await assertMutationPermission(PERMISSION.LEADS_UPDATE);
  const parsed = z.cuid().safeParse(input);
  if (!parsed.success) return { ok: false, error: "Некорректный идентификатор." };
  const job = await prisma.contactMailJob.findUnique({
    where: { id: parsed.data }, select: { leadId: true },
  });
  if (!job) return { ok: false, error: "Уведомление не найдено." };
  const delivered = await deliverContactMailJob(parsed.data, true);
  revalidatePath(`/dashboard/leads/${job.leadId}`);
  revalidatePath("/dashboard/leads");
  return delivered ? { ok: true } : { ok: false, error: "Отправка не удалась. Проверьте SMTP." };
}
