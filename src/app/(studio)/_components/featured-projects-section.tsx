import Link from 'next/link'
import { SiteContainer } from '@/components/layout/site-container'
import { getFeaturedProjects } from '@/features/projects/server/public-queries'
import { PublicProjectCards } from '@/features/projects/components/public-project-cards'
import { SiteSection } from '@/components/layout/site-section'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export async function FeaturedProjectsSection() {
	const projects = await getFeaturedProjects()
	if (!projects.length) return null
	return (
		<SiteSection
			className='bg-brand-charcoal min-h-dvh'
			aria-labelledby='featured-projects-title'
		>
			<SiteContainer className='p-10 gap-20'>
				<h2
					id='featured-projects-title'
					className='font-display text-brand-milk text-center text-4xl md:text-6xl'
				>
					Последние проекты
				</h2>
				<PublicProjectCards projects={projects} layout='expandable' />
				<div className='flex justify-center'>
					<Button
						className={cn(
							'w-fit text-base px-5 h-12 cursor-pointer bg-brand-terracota-accent',
							'transition-colors duration-300 hover:bg-brand-terracota',
						)}
						render={<Link href='/projects'>Смотреть все проекты</Link>}
						nativeButton={false}
					/>
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
