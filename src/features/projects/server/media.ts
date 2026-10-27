import 'server-only'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from '@/lib/db/prisma'
import { s3, mediaBuckets } from '@/lib/storage/s3'

/** Durable best-effort cleanup; failures stay queued for scripts/cleanup-media.ts. */
export async function drainMediaDeletionJobs(limit = 50): Promise<void> {
  const jobs = await prisma.storageDeletionJob.findMany({
    orderBy: { createdAt: 'asc' }, take: limit,
  })
  for (const job of jobs) {
    try {
      if (job.bucket === mediaBuckets.public) {
        const promoting = await prisma.stagedProjectUpload.findFirst({
          where: { finalKey: job.objectKey, status: 'PROMOTING' }, select: { id: true },
        })
        if (promoting) continue
        const stillUsed = await prisma.projectImage.findUnique({
          where: { objectKey: job.objectKey }, select: { id: true },
        })
        if (stillUsed) {
          console.warn('Skipping deletion: public image still referenced', job.id)
          continue
        }
      }
      await s3.send(new DeleteObjectCommand({ Bucket: job.bucket, Key: job.objectKey }))
      await prisma.storageDeletionJob.delete({ where: { id: job.id } })
    } catch (error) {
      console.error('Media deletion is queued for retry', job.id, error)
    }
  }
}
