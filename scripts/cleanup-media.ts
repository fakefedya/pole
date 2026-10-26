/**
 * Schedule this independently (e.g. hourly): bun scripts/cleanup-media.ts
 * S3 lifecycle independently expires tmp/ objects after 2 days.
 * This job also cleans PostgreSQL staging rows and retries public S3 deletion.
 */
import { loadEnvConfig } from '@next/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

loadEnvConfig(process.cwd())
const required = (key: string) => {
  const value = process.env[key]
  if (!value) throw new Error(`Missing ${key}`)
  return value
}
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: required('DATABASE_URL') }),
})
const s3 = new S3Client({
  endpoint: required('S3_ENDPOINT'), region: required('S3_REGION'),
  forcePathStyle: true,
  credentials: {
    accessKeyId: required('S3_ACCESS_KEY'), secretAccessKey: required('S3_SECRET_KEY'),
  },
})
const privateBucket = required('S3_PRIVATE_BUCKET')

async function main() {
  const stale = await prisma.stagedProjectUpload.findMany({
    where: { expiresAt: { lt: new Date() } }, orderBy: { expiresAt: 'asc' }, take: 200,
  })
  for (const row of stale) {
    try {
      const attached = await prisma.projectImage.findUnique({
        where: { objectKey: row.finalKey }, select: { id: true },
      })
      if (!attached) {
        // The copy might have succeeded just before a network/database crash.
        await s3.send(new DeleteObjectCommand({ Bucket: required('S3_PUBLIC_BUCKET'), Key: row.finalKey }))
      }
      await s3.send(new DeleteObjectCommand({ Bucket: privateBucket, Key: row.tempKey }))
      await prisma.stagedProjectUpload.delete({ where: { id: row.id } })
    } catch (error) { console.error('Staged cleanup failed', row.id, error) }
  }

  const pending = await prisma.storageDeletionJob.findMany({
    orderBy: { createdAt: 'asc' }, take: 500,
  })
  for (const row of pending) {
    try {
      if (row.bucket === required('S3_PUBLIC_BUCKET')) {
        const live = await prisma.projectImage.findUnique({
          where: { objectKey: row.objectKey }, select: { id: true },
        })
        if (live) {
          console.error('Skipping deletion still referenced by live image', row.objectKey)
          continue
        }
      }
      await s3.send(new DeleteObjectCommand({ Bucket: row.bucket, Key: row.objectKey }))
      await prisma.storageDeletionJob.delete({ where: { id: row.id } })
    } catch (error) { console.error('Deferred deletion failed', row.id, error) }
  }
  console.log(`Cleanup checked ${stale.length} stale uploads and ${pending.length} deletion jobs`)
}

try { await main() } finally { await prisma.$disconnect(); s3.destroy() }
