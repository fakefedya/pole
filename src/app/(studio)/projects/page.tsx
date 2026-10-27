import { Suspense } from 'react'
import { SiteContainer } from '@/components/layout/site-container'
import { PublicProjectCards } from '@/features/projects/components/public-project-cards'
import { getPublishedProjects } from '@/features/projects/server/public-queries'

async function ProjectIndex() {
  const projects = await getPublishedProjects()
  return <PublicProjectCards projects={projects} />
}
export default function ProjectsPage() {
  return <section className='min-h-dvh bg-brand-milk px-6 py-24 text-brand-charcoal md:px-10'>
    <SiteContainer className='mx-auto max-w-7xl gap-12'>
      <div><p className='text-xs uppercase tracking-[0.2em] opacity-60'>STUDIO POLE / Портфолио</p>
        <h1 className='mt-4 font-display text-5xl md:text-7xl'>Проекты</h1></div>
      <Suspense fallback={<p className='py-12 text-base opacity-65'>Загрузка проектов…</p>}><ProjectIndex /></Suspense>
    </SiteContainer>
  </section>
}
