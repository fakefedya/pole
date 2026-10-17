import { env } from '../../env'

export const getPublicMediaBaseUrl = (): string => {
	const url = new URL(env.S3_PUBLIC_BASE_URL)

	return `${url.origin}${url.pathname.replace(/\/+$/, '')}`
}
