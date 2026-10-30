import { Suspense } from 'react'
import { AboutSection } from './_components/about-section'
import { HeroSection } from './_components/hero/hero-section'
import { SolutionsSection } from './_components/solutions-section'
import { FeaturedProjectsSection } from './_components/featured-projects-section'

export function HomePage() {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<Suspense
				fallback={
					<section
						className='min-h-80 bg-brand-milk'
						aria-label='Загрузка проектов'
					/>
				}
			>
				<FeaturedProjectsSection />
			</Suspense>
			<SolutionsSection />
		</>
	)
}
export { HomePage as default }
