export const getPublicMediaBaseUrl = (): string => {
	const value = process.env.S3_PUBLIC_BASE_URL

	if (!value) {
		throw new Error('S3_PUBLIC_BASE_URL is required')
	}

	let url: URL

	try {
		url = new URL(value)
	} catch {
		throw new Error('S3_PUBLIC_BASE_URL must be an absolute URL')
	}

	if (url.username || url.password || url.search || url.hash) {
		throw new Error(
			'S3_PUBLIC_BASE_URL must not contain credentials, query or hash',
		)
	}

	const isDevLoopback =
		process.env.NODE_ENV === 'development' &&
		url.protocol === 'http:' &&
		['127.0.0.1', 'localhost'].includes(url.hostname)

	if (url.protocol !== 'https:' && !isDevLoopback) {
		throw new Error(
			'S3_PUBLIC_BASE_URL must use HTTPS outside local development',
		)
	}

	return `${url.origin}${url.pathname.replace(/\/+$/, '')}`
}
