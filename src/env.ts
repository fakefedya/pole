import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const isAllowedPublicProtocol = (url: URL): boolean => {
	if (url.protocol === 'https:') {
		return true
	}

	return (
		url.protocol === 'http:' &&
		['localhost', '127.0.0.1'].includes(url.hostname)
	)
}

const hasSafeUrlParts = (url: URL): boolean => {
	return !url.username && !url.password && !url.search && !url.hash
}

const isValidPublicMediaUrl = (value: string): boolean => {
	const url = new URL(value)

	return (
		isAllowedPublicProtocol(url) && hasSafeUrlParts(url) && url.pathname !== '/'
	)
}

const isValidAuthUrl = (value: string): boolean => {
	const url = new URL(value)

	return (
		isAllowedPublicProtocol(url) && hasSafeUrlParts(url) && url.pathname === '/'
	)
}

export const env = createEnv({
	server: {
		// S3 API
		S3_ENDPOINT: z.url(),
		S3_REGION: z.string().trim().min(1),
		S3_ACCESS_KEY: z.string().trim().min(8),
		S3_SECRET_KEY: z.string().trim().min(10),
		S3_PUBLIC_BUCKET: z.string().trim().min(3),
		S3_PUBLIC_BASE_URL: z.url().refine(isValidPublicMediaUrl, {
			message: 'Expected HTTPS URL or loopback HTTP URL with bucket path',
		}),
		S3_PRIVATE_BUCKET: z.string().trim().min(3),

		// DB
		DATABASE_URL: z.url().refine(
			(value) => {
				const protocol = new URL(value).protocol

				return ['postgres:', 'postgresql:'].includes(protocol)
			},
			{
				message: 'Expected PostgresSQL connection URL',
			},
		),

		// Better Auth
		AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url().refine(isValidAuthUrl, {
			message: 'Expected HTTPS origin or loopback HTTP origin',
		}),

		// SMTP
		SMTP_HOST: z.string().trim().min(1),
		SMTP_PORT: z.coerce.number().int().min(1).max(65535),
		SMTP_SECURE: z
			.enum(['true', 'false'])
			.transform((value) => value === 'true'),
		SMTP_USER: z.string().optional(),
		SMTP_PASSWORD: z.string().optional(),
		SMTP_FROM: z.string().trim().min(3),
	},

	experimental__runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
