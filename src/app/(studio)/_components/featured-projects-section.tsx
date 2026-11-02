import Link from 'next/link'
import { SiteContainer } from '@/components/layout/site-container'
import { getFeaturedProjects } from '@/features/projects/server/public-queries'
import { PublicProjectCards } from '@/features/projects/components/public-project-cards'
import { SiteSection } from '@/components/layout/site-section'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export async function FeaturedProjectsSection() {
	const projects = await getFeaturedProjects()
	if (!projects.length) return null
	return (
		<SiteSection id='featured-projects' className='min-h-dvh'>
			<SiteContainer className='p-10 gap-8'>
				<div className='flex flex-col gap-4 max-w-2/3'>
					<h2
						id='featured-projects-title'
						className='font-display text-brand-milk  text-4xl md:text-6xl leading-[1.2]'
					>
						Последние проекты
					</h2>
					<p className='text-2xl text-brand-milk/80'>
						Разрабатываем индивидуальные проекты, предлагаем готовые решения и
						создаём понятные инструменты для самостоятельной работы с
						интерьером.
					</p>
					<Link
						href='/projects'
						className={cn(
							buttonVariants({ variant: 'default', size: 'lg' }),
							'h-12 w-fit px-5 text-sm',
							'bg-brand-terracota-accent',
							'transition-colors duration-300 hover:bg-brand-terracota',
						)}
					>
						Смотреть все проекты
					</Link>
				</div>
				<PublicProjectCards projects={projects} layout='expandable' />
				<div className='flex'></div>
			</SiteContainer>
		</SiteSection>
	)
}
