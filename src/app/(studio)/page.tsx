import { AboutSection } from './_components/about-section'
import { HeroSection } from './_components/hero-section'
import { SolutionsSection } from './_components/solutions-section'

export function HomePage() {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<SolutionsSection />
		</>
	)
}

export { HomePage as default }
