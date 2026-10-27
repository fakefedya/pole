import 'server-only'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/db/prisma'

/** PostgreSQL SERIALIZABLE + bounded retry on serialization/deadlock conflicts. */
export async function serializable<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await prisma.$transaction(work, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5_000,
        timeout: 15_000,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034' && attempt < 3) continue
      throw error
    }
  }
  throw new Error('Не удалось завершить транзакцию.')
}

/** Serialize uploads and gallery/publishing mutations for the same project. */
export async function lockProject(tx: Prisma.TransactionClient, id: string): Promise<void> {
  const rows = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT "id" FROM "Project" WHERE "id" = ${id} FOR UPDATE
  `
  if (rows.length !== 1) throw new Error('Проект больше не существует.')
}

/** Serialize administration changes to keep one active administrator. */
export async function lockAdminMutations(tx: Prisma.TransactionClient): Promise<void> {
  await tx.$queryRaw`SELECT 1::int AS ok FROM (SELECT pg_advisory_xact_lock(41827026)) AS lock_result`
}
