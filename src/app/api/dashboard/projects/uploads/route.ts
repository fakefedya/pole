import { randomUUID } from 'node:crypto'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse, type NextRequest } from 'next/server'
import sharp from 'sharp'
import { z } from 'zod'
import { PERMISSION } from '@/lib/auth/authorization'
import { assertMutationPermission } from '@/features/auth/server/access'
import { prisma } from '@/lib/db/prisma'
import { s3, mediaBuckets } from '@/lib/storage/s3'
import { serializable, lockProject } from '@/lib/db/transaction-guards'

const MAX_FILE_BYTES = 12 * 1024 * 1024
const IMAGE_MIMES = new Set([
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/avif',
])
const projectIdSchema = z.string().min(1).max(128)
const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 128 * 1024

/** A Content-Length header can be absent or forged: stop receiving bytes ourselves. */
async function boundedFormData(request: Request): Promise<FormData> {
  const type = request.headers.get('content-type') ?? ''
  if (!type.toLowerCase().startsWith('multipart/form-data;') || !type.includes('boundary=')) {
    throw new Error('TYPE')
  }
  if (!request.body) throw new Error('TYPE')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > MAX_REQUEST_BYTES) {
        await reader.cancel('File exceeds request limit')
        throw new Error('TOO_LARGE')
      }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const buffer = new ArrayBuffer(total)
  const data = new Uint8Array(buffer)
  let offset = 0
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.byteLength }
  const parsed = new Request('http://localhost/upload', {
    method: 'POST', headers: { 'content-type': type }, body: buffer,
  })
  return parsed.formData()
}

const fail = (message: string, status: number) =>
	NextResponse.json(
		{ error: message },
		{ status, headers: { 'Cache-Control': 'no-store' } },
	)

export async function POST(request: NextRequest) {
	let session
	try {
		session = await assertMutationPermission(PERMISSION.PROJECT_UPDATE)
	} catch {
		return fail('Нет прав на загрузку изображений.', 403)
	}

	// This endpoint uses session cookies; reject foreign origins.
	const origin = request.headers.get('origin')
	if (!origin || origin !== request.nextUrl.origin)
		return fail('Invalid Origin', 403)
	const length = Number(request.headers.get('content-length') ?? 0)
	if (!Number.isFinite(length) || length > MAX_REQUEST_BYTES)
		return fail('Файл слишком большой.', 413)

	let reservedId: string | null = null
	try {
		const body = await boundedFormData(request)
		const parsedId = projectIdSchema.safeParse(body.get('projectId'))
		const file = body.get('file')
		if (!parsedId.success || !(file instanceof File))
			return fail('Некорректный запрос.', 400)
		if (file.size === 0 || file.size > MAX_FILE_BYTES)
			return fail('Максимум 12 МБ на файл.', 413)
		if (!IMAGE_MIMES.has(file.type))
			return fail('Поддерживаются JPG, PNG, WebP и AVIF.', 415)


		const imageId = randomUUID()
		const tempKey = `tmp/portfolio/${parsedId.data}/${imageId}.webp`
		const finalKey = `portfolio/${parsedId.data}/${imageId}.webp`
		// Reserve capacity under the project row lock BEFORE calling S3.
		await serializable(async (tx) => {
			await lockProject(tx, parsedId.data)
			const [imageCount, reservedCount, personalCount] = await Promise.all([
				tx.projectImage.count({ where: { projectId: parsedId.data } }),
				tx.stagedProjectUpload.count({ where: { projectId: parsedId.data, expiresAt: { gt: new Date() } } }),
				tx.stagedProjectUpload.count({ where: { uploaderId: session.user.id, expiresAt: { gt: new Date() } } }),
			])
			if (imageCount + reservedCount >= 100) throw new Error('CAPACITY')
			if (personalCount >= 8) throw new Error('PENDING')
			await tx.stagedProjectUpload.create({ data: {
				id: imageId, projectId: parsedId.data, uploaderId: session.user.id,
				tempKey, finalKey, width: 0, height: 0,
				sizeBytes: file.size, status: 'UPLOADING',
				expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
			} })
		})
		reservedId = imageId

		// Decode and re-encode rather than trusting filename or Content-Type.
		const input = Buffer.from(await file.arrayBuffer())
		const processed = await sharp(input, {
			limitInputPixels: 32_000_000,
			animated: false,
		})
			.rotate()
			.resize({
				width: 2600,
				height: 2600,
				fit: 'inside',
				withoutEnlargement: true,
			})
			.webp({ quality: 84, effort: 4 })
			.toBuffer({ resolveWithObject: true })
		const { width, height } = processed.info
		if (!width || !height || width < 100 || height < 100) {
			throw new Error('DIMENSIONS')
		}

		// A process crash leaves an UPLOADING reservation which TTL cleanup removes.
		await s3.send(new PutObjectCommand({
			Bucket: mediaBuckets.private, Key: tempKey,
			Body: processed.data, ContentType: 'image/webp', CacheControl: 'no-store',
		}))
		await prisma.stagedProjectUpload.update({
			where: { id: imageId }, data: { status: 'STAGED', width, height, sizeBytes: processed.data.length },
		})

		return NextResponse.json(
			{ uploadId: imageId, width, height },
			{ status: 201, headers: { 'Cache-Control': 'no-store' } },
		)
	} catch (error) {
		// Release failed reservations immediately; private tmp objects still expire via S3 lifecycle.
		if (reservedId) {
			try { await prisma.stagedProjectUpload.deleteMany({ where: { id: reservedId, status: 'UPLOADING' } }) }
			catch (cleanupError) { console.error('Reservation cleanup failed', cleanupError) }
		}
		console.error('Staged image upload failed', error)
		if (error instanceof Error) {
			if (error.message === 'TOO_LARGE') return fail('Запрос превышает допустимый размер.', 413)
			if (error.message === 'TYPE') return fail('Ожидается multipart/form-data.', 415)
			if (error.message === 'CAPACITY') return fail('Максимум 100 фотографий, включая загружаемые.', 409)
			if (error.message === 'PENDING') return fail('Слишком много незавершённых загрузок (максимум 8).', 429)
			if (error.message === 'DIMENSIONS') return fail('Изображение имеет недопустимый размер.', 400)
		}
		return fail('Не удалось загрузить изображение.', 500)
	}
}
