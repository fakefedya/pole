import { SiteContainer } from '@/components/layout/site-container'
import { SiteSection } from '@/components/layout/site-section'
import { Button } from '@/components/ui/button'
import { getPublicImageUrl } from '@/lib/storage/public-image'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type Description = {
	title: string
	subtitle: string
	description: string
}

const sectionDescription: Description = {
	title: 'Авторская студия дизайна интерьера',
	subtitle: 'Работаем в Санкт-Петербурге и онлайн по России.',
	description:
		'Разрабатываем индивидуальные проекты, предлагаем готовые решения и создаём понятные инструменты для самостоятельной работы с интерьером.',
}

const SignboardSrc = getPublicImageUrl('site/home/about/pole-signboard.png')

export function AboutSection() {
	return (
		<SiteSection>
			<SiteContainer className='pt-70 pb-35 px-10'>
				<div className='flex flex-col gap-8'>
					<div className='flex flex-col gap-4 max-w-2/3'>
						<h2 className='font-display text-6xl text-brand-milk leading-[1.2]'>
							{sectionDescription.title}
						</h2>
						<p className='text-2xl text-brand-milk/80'>
							{sectionDescription.subtitle}
						</p>
					</div>
					<div className='flex gap-2 item-center'>
						<Button
							className={cn(
								'w-fit text-sm px-5 h-12 cursor-pointer bg-brand-terracota-accent',
								'transition-colors duration-300 hover:bg-brand-terracota',
							)}
							render={<a href={'#solutions'}>Выбрать направление</a>}
							nativeButton={false}
						/>
						<Button
							className={cn(
								'w-fit text-sm px-5 h-12 cursor-pointer bg-brand-terracota-accent',
								'transition-colors duration-300 hover:bg-brand-terracota',
							)}
							render={<a href={'#featured-projects'}>Последние проекты</a>}
							nativeButton={false}
						/>
					</div>
					<div className='relative aspect-video w-full overflow-hidden rounded-2xl'>
						<Image
							src={SignboardSrc}
							alt='Надпись POLE'
							className='object-cover'
							fill
						/>
					</div>
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
