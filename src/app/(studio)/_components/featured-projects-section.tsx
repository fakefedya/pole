import Link from 'next/link'
import { SiteContainer } from '@/components/layout/site-container'
import { getFeaturedProjects } from '@/features/projects/server/public-queries'
import { PublicProjectCards } from '@/features/projects/components/public-project-cards'
import { SiteSection } from '@/components/layout/site-section'

export async function FeaturedProjectsSection() {
	const projects = await getFeaturedProjects()
	if (!projects.length) return null
	return (
		<SiteSection
			className='bg-brand-charcoal min-h-dvh'
			aria-labelledby='featured-projects-title'
		>
			<SiteContainer className='max-w-7xl p-10 gap-20'>
				<h2
					id='featured-projects-title'
					className='font-display text-brand-milk text-center text-4xl md:text-6xl'
				>
					Последние проекты
				</h2>
				<PublicProjectCards projects={projects} layout='expandable' />
				<div className='flex justify-center'>
					<Link
						href='/projects'
						className='rounded-full px-10 py-5 bg-brand-milk w-fit'
					>
						Смотреть все проекты
					</Link>
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
