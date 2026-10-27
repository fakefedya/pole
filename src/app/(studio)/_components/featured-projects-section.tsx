import Link from 'next/link'
import { SiteContainer } from '@/components/layout/site-container'
import { getFeaturedProjects } from '@/features/projects/server/public-queries'
import { PublicProjectCards } from '@/features/projects/components/public-project-cards'

export async function FeaturedProjectsSection() {
  const projects = await getFeaturedProjects()
  if (!projects.length) return null
  return (
    <section className='bg-brand-milk px-6 py-20 text-brand-charcoal md:px-10 md:py-28' aria-labelledby='featured-projects-title'>
      <SiteContainer className='mx-auto max-w-7xl gap-10'>
        <div className='flex flex-wrap items-end justify-between gap-5'>
          <div>
            <p className='mb-3 text-xs uppercase tracking-[0.2em] opacity-60'>STUDIO POLE / Портфолио</p>
            <h2 id='featured-projects-title' className='font-display text-4xl md:text-6xl'>Наши проекты</h2>
          </div>
          <Link href='/projects' className='border-b border-current pb-1 text-sm transition-opacity hover:opacity-60'>Смотреть все проекты</Link>
        </div>
        <PublicProjectCards projects={projects} />
      </SiteContainer>
    </section>
  )
}
