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
		<SiteSection>
			<SiteContainer>
				<h2>{sectionDescription.title}</h2>
				<p>{sectionDescription.subtitle}</p>
				<p>{sectionDescription.description}</p>
			</SiteContainer>
		</SiteSection>
	)
}
