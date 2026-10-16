import 'server-only'

import { getPublicMediaBaseUrl } from './public-media-config'

const publicImageKeyPattern =
	/^(?:site|portfolio|products)\/(?:[a-z0-9-]+\/)*[a-zA-Z0-9-]+\.(?:avif|webp|jpe?g|png)$/

/** The key is relative to the public bucket; never pass an arbitrary URL. */
export const getPublicImageUrl = (objectKey: string): string => {
	if (objectKey.length > 240 || !publicImageKeyPattern.test(objectKey)) {
		throw new Error('Invalid public image object key')
	}

	return `${getPublicMediaBaseUrl()}/${objectKey}`
}
