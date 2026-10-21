import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const isValidPublicMediaUrl = (value: string): boolean => {
	const url = new URL(value)

	const isLocalDevelopment =
		process.env.NODE_ENV === 'development' &&
		url.protocol === 'http:' &&
		['localhost', '127.0.0.1'].includes(url.hostname)

	const validProtocol = url.protocol === 'https:' || isLocalDevelopment

	return (
		validProtocol &&
		!url.username &&
		!url.password &&
		!url.search &&
		!url.hash &&
		url.pathname !== '/'
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
			message: 'Expected HTTPS URL or local HTTP URL in development',
		}),
		S3_PRIVATE_BUCKET: z.string().trim().min(3),

    // DB
    DATABASE_URL: z.url().refine(
      (value) => {
        const protocol = new URL(value).protocol

        return ['postgres:', 'postgresql:'].includes(protocol)
      },
      {
        message: 'Expected PostgresSQL connection URL'
      }
    )
    // Better Auth
    AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.(url).refine(
      (value) => {
        const url = new URL(value)

        return (
          url.protocol === 'https:' ||
            (
              process.env.NODE_ENV !== 'production' &&
                url.protocol === 'http:' &&
                ['localhost', '127.0.0.1'].includes(url.hostname)
          )
        )
      },
      {
        message: 'Expected HTTPS, or localhost HTTP outside production',
      },
    ),
	},

	experimental__runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
