import { AboutSection } from './_components/about-section'
import { HeroSection } from './_components/hero-section'

export function HomePage() {
	return (
		<>
			<HeroSection />
			<AboutSection />
		</>
	)
}

export { HomePage as default }
