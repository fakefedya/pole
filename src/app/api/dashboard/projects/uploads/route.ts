import { randomUUID } from 'node:crypto'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse, type NextRequest } from 'next/server'
import sharp from 'sharp'
import { z } from 'zod'
import { PERMISSION } from '@/lib/auth/authorization'
import { assertMutationPermission } from '@/features/auth/server/access'
import { prisma } from '@/lib/db/prisma'
import { s3, mediaBuckets } from '@/lib/storage/s3'

// export const runtime = 'nodejs'
// export const dynamic = 'force-dynamic'

const MAX_FILE_BYTES = 12 * 1024 * 1024
const IMAGE_MIMES = new Set([
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/avif',
])
const projectIdSchema = z.string().min(1).max(128)

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
	if (origin && origin !== request.nextUrl.origin)
		return fail('Invalid Origin', 403)
	const length = Number(request.headers.get('content-length') ?? 0)
	if (length > MAX_FILE_BYTES + 100_000)
		return fail('Файл слишком большой.', 413)

	try {
		const body = await request.formData()
		const parsedId = projectIdSchema.safeParse(body.get('projectId'))
		const file = body.get('file')
		if (!parsedId.success || !(file instanceof File))
			return fail('Некорректный запрос.', 400)
		if (file.size === 0 || file.size > MAX_FILE_BYTES)
			return fail('Максимум 12 МБ на файл.', 413)
		if (!IMAGE_MIMES.has(file.type))
			return fail('Поддерживаются JPG, PNG, WebP и AVIF.', 415)

		const project = await prisma.project.findUnique({
			where: { id: parsedId.data },
			select: { id: true, _count: { select: { images: true } } },
		})
		if (!project)
			return fail('Проект не найден. Сначала сохраните черновик.', 404)
		if (project._count.images >= 100)
			return fail('Максимум 100 изображений.', 409)
		const pendingCount = await prisma.stagedProjectUpload.count({
			where: { uploaderId: session.user.id, expiresAt: { gt: new Date() } },
		})
		if (pendingCount >= 30)
			return fail('Слишком много незавершённых загрузок. Повторите позже.', 429)

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
			return fail('Изображение имеет недопустимый размер.', 400)
		}

		const imageId = randomUUID()
		const tempKey = `tmp/portfolio/${parsedId.data}/${imageId}.webp`
		const finalKey = `portfolio/${parsedId.data}/${imageId}.webp`
		await s3.send(
			new PutObjectCommand({
				Bucket: mediaBuckets.private,
				Key: tempKey,
				Body: processed.data,
				ContentType: 'image/webp',
				CacheControl: 'no-store',
			}),
		)

		// If DB insertion fails, lifecycle still expires the private temp object.
		await prisma.stagedProjectUpload.create({
			data: {
				id: imageId,
				projectId: parsedId.data,
				uploaderId: session.user.id,
				tempKey,
				finalKey,
				width,
				height,
				sizeBytes: processed.data.length,
				expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
			},
		})

		return NextResponse.json(
			{ uploadId: imageId, width, height },
			{ status: 201, headers: { 'Cache-Control': 'no-store' } },
		)
	} catch (error) {
		console.error('Staged image upload failed', error)
		return fail('Не удалось загрузить изображение.', 500)
	}
}
