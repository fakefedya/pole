export const getPublicMediaBaseUrl = (): string => {
	const value = process.env.NEXT_PUBLIC_STORAGE_URL

	if (!value) {
		throw new Error('NEXT_PUBLIC_STORAGE_URL is required')
	}

	let url: URL

	try {
		url = new URL(value)
	} catch {
		throw new Error('NEXT_PUBLIC_STORAGE_URL must be an absolute URL')
	}

	if (url.username || url.password || url.search || url.hash) {
		throw new Error(
			'NEXT_PUBLIC_STORAGE_URL must not contain credentials, query or hash',
		)
	}

	const isDevLoopback =
		process.env.NODE_ENV === 'development' &&
		url.protocol === 'http:' &&
		['127.0.0.1', 'localhost'].includes(url.hostname)

	if (url.protocol !== 'https:' && !isDevLoopback) {
		throw new Error(
			'NEXT_PUBLIC_STORAGE_URL must use HTTPS outside local development',
		)
	}

	// Remove the trailing slash to produce stable media URLs.
	return `${url.origin}${url.pathname.replace(/\/+$/, '')}`
}
