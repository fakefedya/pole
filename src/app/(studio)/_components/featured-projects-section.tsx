import Link from 'next/link'
import { SiteContainer } from '@/components/layout/site-container'
import { getFeaturedProjects } from '@/features/projects/server/public-queries'
import { PublicProjectCards } from '@/features/projects/components/public-project-cards'
import { SiteSection } from '@/components/layout/site-section'
import { Button, buttonVariants } from '@/components/ui/button'
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
					<Link
						href='/projects'
						className={cn(
							buttonVariants({ variant: 'default', size: 'lg' }),
							'h-12 w-fit px-5 text-base',
							'bg-brand-terracota-accent',
							'transition-colors duration-300 hover:bg-brand-terracota',
						)}
					>
						Смотреть все проекты
					</Link>
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
