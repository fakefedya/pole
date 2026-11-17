import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function getPublishedPrices() {
  "use cache";
  cacheTag("service-prices");
  cacheLife("hours");

  return prisma.servicePrice.findMany({
    where: { isPublished: true },
    select: { code: true, amount: true },
  });
}

export async function listDashboardPrices() {
  return prisma.servicePrice.findMany({
    select: {
      code: true,
      amount: true,
      isPublished: true,
      revision: true,
      updatedAt: true,
    },
  });
}
