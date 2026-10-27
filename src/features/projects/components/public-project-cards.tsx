import Image from 'next/image'
import Link from 'next/link'
import type { PublicProjectCard } from '@/features/projects/server/public-queries'

export function PublicProjectCards({ projects }: { projects: PublicProjectCard[] }) {
  if (!projects.length) return <p className='py-12 text-base opacity-65'>Опубликованных проектов пока нет.</p>
  return (
    <div className='grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3'>
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.slug}`} className='group block min-w-0'>
          <div className='relative aspect-[4/5] overflow-hidden bg-brand-espresso'>
            <Image src={project.coverUrl} alt={project.coverAlt} fill sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
              className='object-cover transition-transform duration-700 group-hover:scale-[1.045]' />
          </div>
          <div className='mt-4 flex items-start justify-between gap-4'>
            <div className='min-w-0'>
              <h3 className='font-display text-2xl leading-tight'>{project.title}</h3>
              {project.location && <p className='mt-2 text-sm opacity-65'>{project.location}</p>}
            </div>
            {project.areaSqM && <span className='shrink-0 text-sm opacity-65'>{project.areaSqM} м²</span>}
          </div>
        </Link>
      ))}
    </div>
  )
}
