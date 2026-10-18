import { SiteSection } from '@/components/layout/site-section'
import { getPublicImageUrl } from '@/lib/storage/public-image'
import Image from 'next/image'

const testImageKey = 'site/home/hero/hero.jpg'

export default function Home() {
	return (
		<SiteSection className='min-h-full h-dvh'>
			<div className='h-full relative aspect-video w-full overflow-hidden rounded-xl'>
				<Image
					src={getPublicImageUrl(testImageKey)}
					alt='Тестовая визуализация интерьера STUDIO POLE'
					fill
					sizes='(max-width: 768px) 100vw, 960px'
					className='object-cover'
					preload
				/>
			</div>
		</SiteSection>
	)
}
