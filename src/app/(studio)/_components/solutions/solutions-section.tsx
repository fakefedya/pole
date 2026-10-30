import { SiteContainer } from '@/components/layout/site-container'
import { SiteSection } from '@/components/layout/site-section'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { solutions, solutionThemes } from './solutions'
import Image from 'next/image'

export function SolutionsSection() {
	return (
		<SiteSection id='solutions' className='relative isolate'>
			{solutions.map((solution, index) => (
				<article
					key={solution.title}
					style={{ zIndex: index + 1 }}
					className={cn(
						'relative flex min-h-dvh w-full items-center flex-col',
						'md:sticky md:top-0 md:h-dvh',
						solutionThemes[index % solutionThemes.length],
					)}
				>
					<SiteContainer className='h-full p-10'>
						<div className='flex h-full flex-col justify-between'>
							<div className='flex flex-col gap-8 '>
								<h2 className='font-display text-4xl md:text-6xl'>
									{solution.title}
								</h2>

								{/* Варианты услуг */}
								<div className='flex flex-wrap gap-2'>
									{solution.options.map((option) => (
										<span
											key={option}
											className='rounded-full border border-current/25 px-4 py-2 text-sm'
										>
											{option}
										</span>
									))}
								</div>

								{/* Описание */}
								<p className='max-w-2xl text-lg leading-relaxed'>
									{solution.description}
								</p>

								{/* CTA */}
								<div>
									<Link
										href={solution.action.href}
										className={cn(
											'inline-flex items-center justify-center',
											'rounded-full px-6 py-3',
											'font-medium text-base',
											'transition-opacity hover:opacity-80',
											solution.action.bgColor,
											solution.action.textColor,
										)}
									>
										{solution.action.label}
									</Link>
								</div>
							</div>
							<div className='grid grid-cols-4 gap-4'>
								{solution.images.map((image) => (
									<div
										key={image.alt}
										className='aspect-4/5 relative flex items-center justify-center overflow-hidden rounded-2xl'
									>
										<Image
											src={image.src}
											alt={image.alt}
											fill
											className='object-cover'
										/>
									</div>
								))}
							</div>
						</div>
					</SiteContainer>
				</article>
			))}
		</SiteSection>
	)
}
