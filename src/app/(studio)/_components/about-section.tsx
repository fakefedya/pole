import { SiteContainer } from '@/components/layout/site-container'
import { SiteSection } from '@/components/layout/site-section'
import { Button } from '@/components/ui/button'
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

export function AboutSection() {
	return (
		<SiteSection className='bg-brand-milk'>
			<SiteContainer className='py-35 px-10'>
				<div className='max-w-full mx-auto flex flex-col gap-8 items-center text-center'>
					<div className='relative h-48 w-full max-w-3xl mb-10'>
						<Image
							src='/brand/logo-pole.svg'
							alt='Надпись POLE'
							className='object-cover'
							fill
						/>
					</div>
					<div className='flex flex-col gap-4 items-center'>
						<h2 className='font-display text-4xl text-brand-charcoal'>
							{sectionDescription.title}
						</h2>
						<p className='text-2xl font-semibold text-brand-terracota'>
							{sectionDescription.subtitle}
						</p>
						<p className=' max-w-[80%] text-xl text-brand-charcoal'>
							{sectionDescription.description}
						</p>
					</div>

					<Button
						className={cn(
							'w-fit text-base px-5 h-12 cursor-pointer bg-brand-terracota-accent',
							'transition-colors duration-300 hover:bg-brand-terracota',
						)}
						render={<a href={'#solutions'}>Выбрать направление</a>}
						nativeButton={false}
					/>
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
