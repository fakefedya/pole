import "server-only";

import { prisma } from "@/lib/db/prisma";
import { env } from "@/env";
import { smtpTransport } from "@/lib/email/smtp-transport";
import { contactMethodLabel } from "@/features/contacts/config/contact-labels";

/** Retry-safe claim prevents two concurrent requests from sending the same job. */
export async function deliverContactMailJob(jobId: string, force = false) {
  const now = new Date();
  const job = await prisma.contactMailJob.findUnique({
    where: { id: jobId },
    include: { lead: { include: { category: { select: { name: true } } } } },
  });
  if (!job || job.status === "SENT" || (!force && job.attempts >= 5)) return false;

  const allowed =
    job.status === "PENDING" ||
    (job.status === "FAILED" && (force || job.nextAttemptAt <= now)) ||
    (job.status === "SENDING" && !!job.lockedUntil && job.lockedUntil <= now);
  if (!allowed) return false;

  const updated = await prisma.contactMailJob.updateMany({
    where: { id: job.id, attempts: job.attempts, status: job.status },
    data: {
      status: "SENDING",
      attempts: { increment: 1 },
      lockedUntil: new Date(now.getTime() + 60_000),
      lastError: null,
    },
  });
  if (updated.count !== 1) return false;

  const lead = job.lead;
  const isStudio = job.recipient === "STUDIO";
  const text = isStudio
    ? [
        `Новая заявка STUDIO POLE: #${lead.shortCode}`,
        `Имя: ${lead.name}`,
        `Услуга: ${lead.category.name}`,
        `Связаться через: ${contactMethodLabel(lead.contactMethod)}`,
        `Email: ${lead.email}`,
        `Телефон: ${lead.phone}`,
        "", "Сообщение:", lead.message,
        "", `Заявка в панели: /dashboard/leads/${lead.id}`,
      ].join("\n")
    : [
        `Здравствуйте, ${lead.name}!`, "",
        "Спасибо за обращение в STUDIO POLE. Мы получили вашу заявку.",
        "Мы ознакомимся с сообщением и свяжемся с вами выбранным способом.",
        "", `Номер заявки: ${lead.shortCode}`,
        `Направление: ${lead.category.name}`,
        "", "С уважением, STUDIO POLE",
      ].join("\n");

  try {
    await smtpTransport.sendMail({
      from: env.SMTP_FROM,
      to: isStudio ? env.LEAD_NOTIFICATION_EMAIL : lead.email,
      replyTo: isStudio ? lead.email : undefined,
      subject: isStudio ? `STUDIO POLE — новая заявка #${lead.shortCode}` : `STUDIO POLE — заявка #${lead.shortCode} получена`,
      text,
    });
    await prisma.contactMailJob.updateMany({
      where: { id: job.id, status: "SENDING", attempts: job.attempts + 1 },
      data: { status: "SENT", sentAt: new Date(), lockedUntil: null },
    });
    return true;
  } catch (error) {
    // Do not expose SMTP details to the caller or persist credentials in logs.
    console.error("Contact mail delivery failed", { jobId: job.id, recipient: job.recipient });
    const delayMs = Math.min(3_600_000, 60_000 * 2 ** job.attempts);
    await prisma.contactMailJob.updateMany({
      where: { id: job.id, status: "SENDING", attempts: job.attempts + 1 },
      data: {
        status: "FAILED", lockedUntil: null,
        lastError: error instanceof Error ? error.name.slice(0, 100) : "SMTP_ERROR",
        nextAttemptAt: new Date(Date.now() + delayMs),
      },
    });
    return false;
  }
}
