import "server-only";

import { prisma } from "@/lib/db/prisma";

/** Only public, active labels. No authentication required here. */
export async function listPublicContactCategories() {
  return prisma.contactServiceCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { code: true, name: true },
  });
}

export async function listDashboardContactCategories() {
  return prisma.contactServiceCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { code: true, name: true },
  });
}

/** Server-side pagination: do not ship the full customer database to the client. */
export async function listDashboardLeads(input: {
  status?: "NEW" | "IN_PROGRESS" | "CLOSED";
  categoryCode?: string;
  page: number;
}) {
  const where = { status: input.status, categoryCode: input.categoryCode };
  const pageSize = 25;
  const [total, rows] = await prisma.$transaction([
    prisma.contactLead.count({ where }),
    prisma.contactLead.findMany({
      where,
      select: {
        id: true, shortCode: true, name: true, email: true, phone: true,
        contactMethod: true, status: true, revision: true,
        category: { select: { name: true } }, createdAt: true,
        mailJobs: { select: { recipient: true, status: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (input.page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { total, rows, pageSize };
}

export async function getDashboardLead(id: string) {
  return prisma.contactLead.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      mailJobs: { orderBy: { recipient: "asc" } },
      statusChanges: { orderBy: { createdAt: "desc" }, take: 30 },
    },
  });
}
