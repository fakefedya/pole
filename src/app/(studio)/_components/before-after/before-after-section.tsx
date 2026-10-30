import { SiteContainer } from '@/components/layout/site-container'
import { SiteSection } from '@/components/layout/site-section'
import { getPublicImageUrl } from '@/lib/storage/public-image'
import { BeforeAfterCompare } from './before-after-compare'

const beforeSrc = getPublicImageUrl('site/home/before-after/before.jpg')
const afterSrc = getPublicImageUrl('site/home/before-after/after.jpg')

export function BeforeAfterSection() {
	return (
		<SiteSection>
			<SiteContainer className='p-10'>
				<div className='flex flex-col gap-20'>
					<h2 className='font-display text-brand-milk text-center text-4xl md:text-6xl'>
						От идеи до реализации
					</h2>
					<BeforeAfterCompare beforeSrc={beforeSrc} afterSrc={afterSrc} />
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
