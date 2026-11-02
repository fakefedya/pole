import { SiteContainer } from '@/components/layout/site-container'
import { SiteSection } from '@/components/layout/site-section'
import { getPublicImageUrl } from '@/lib/storage/public-image'
import { BeforeAfterCompare } from './before-after-compare'

const beforeSrc = getPublicImageUrl('site/home/before-after/before.jpg')
const afterSrc = getPublicImageUrl('site/home/before-after/after.jpg')

export function BeforeAfterSection() {
	return (
		<SiteSection>
			<SiteContainer className='pt-35 pb-10 px-10'>
				<div className='flex flex-col gap-8'>
					<div className='flex flex-col gap-4 max-w-2/3'>
						<h2 className='font-display text-brand-milk text-6xl'>
							От идеи до реализации
						</h2>
						<p className='text-2xl text-brand-milk/80'>
							Создание стильного интерьера — это сложный и многоэтапный процесс,
							который требует профессионального подхода.
						</p>
					</div>

					<BeforeAfterCompare beforeSrc={beforeSrc} afterSrc={afterSrc} />
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
