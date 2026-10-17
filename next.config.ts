import type { NextConfig } from 'next'
import '@/env'

import { getPublicMediaBaseUrl } from './src/lib/storage/public-media-config'

const mediaBaseUrl = new URL(getPublicMediaBaseUrl())
const mediaPath = mediaBaseUrl.pathname.replace(/\/$/, '')

const nextConfig: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
	images: {
		remotePatterns: [
			{
				protocol: mediaBaseUrl.protocol === 'https:' ? 'https' : 'http',
				hostname: mediaBaseUrl.hostname,
				port: mediaBaseUrl.port,
				pathname: `${mediaPath}/**`,
				search: '',
			},
		],
		formats: ['image/webp'],
		maximumRedirects: 0,
		maximumResponseBody: 8 * 1024 * 1024,
		// Local IP optimization is explicitly permitted ONLY for a loopback dev origin.
		// Production always requires HTTPS (validated by getPublicMediaBaseUrl()).
		dangerouslyAllowLocalIP:
			process.env.NODE_ENV === 'development' &&
			mediaBaseUrl.protocol === 'http:' &&
			['127.0.0.1', 'localhost'].includes(mediaBaseUrl.hostname),
	},
	turbopack: {
		rules: {
			'*.css': {
				loaders: ['@tailwindcss/turbopack'],
				as: '*.css',
			},
		},
	},
}

export default nextConfig
