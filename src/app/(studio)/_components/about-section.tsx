import { SiteContainer } from '@/components/layout/site-container'
import { SiteSection } from '@/components/layout/site-section'

type Description = {
	title: string
	subtitle: string
	description: string
}

const sectionDescription: Description = {
	title: 'POLE — авторская студия дизайна интерьера',
	subtitle: 'Работаем в Санкт-Петербурге и онлайн по России.',
	description:
		'Разрабатываем индивидуальные проекты, предлагаем готовые решения и создаём понятные инструменты для самостоятельной работы с интерьером.',
}

export function AboutSection() {
	return (
		<SiteSection className='bg-brand-milk'>
			<SiteContainer className='max-w-7xl py-75 px-10'>
				<div className='max-w-[80%] mx-auto flex flex-col gap-4 items-center text-center'>
					<h2 className='uppercase font-display text-5xl text-brand-charcoal'>
						{sectionDescription.title}
					</h2>
					<p className='text-3xl font-medium text-brand-terracota'>
						{sectionDescription.subtitle}
					</p>
					<p className='text-xl text-brand-charcoal'>
						{sectionDescription.description}
					</p>
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
