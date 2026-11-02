import { SiteContainer } from '@/components/layout/site-container'
import { SiteSection } from '@/components/layout/site-section'
import { buttonVariants } from '@/components/ui/button'
import { getPublicImageUrl } from '@/lib/storage/public-image'
import { cn } from '@/lib/utils'
import { Certificate, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function AuthorSection() {
	return (
		<SiteSection>
			<SiteContainer className='py-35 px-10'>
				<div className='flex flex-col gap-8'>
					<div className='flex flex-col gap-2 max-w-2/3'>
						<h2 className='font-display text-6xl text-brand-milk leading-[1.2]'>
							Продуманность, заметная в каждой детали
						</h2>
						<p className='text-2xl text-brand-milk/80'></p>
					</div>

					<div className='flex gap-10'>
						<div className='w-full max-w-1/3  flex flex-col gap-4'>
							<div className='relative min-h-150 overflow-hidden rounded-2xl'>
								<div className='absolute inset-0 flex items-center justify-center'>
									<Image
										src={getPublicImageUrl(
											'site/home/author/polina-working.png',
										)}
										alt='Полина'
										className='object-cover'
										fill
									/>
								</div>
							</div>
							<div className='flex flex-col gap-1'>
								<p className='text-xl font-base text-brand-milk'>
									Полина Полевая,{' '}
									<span className='text-brand-milk/80'>
										основатель студии POLE
									</span>
								</p>
							</div>
						</div>
						<div className='w-fill flex flex-col gap-10'>
							<p className='text-2xl text-brand-milk/80'>
								Соединяю архитектурный подход с вниманием к повседневной жизни:
								как вы двигаетесь по дому, где храните вещи и какой свет нужен
								вечером.
							</p>

							<div className='flex gap-4 w-full'>
								<div className='w-fit flex gap-5 items-center rounded-md bg-neutral-900 p-1 py-2 pr-5'>
									<GraduationCap size={20} className='ml-4 text-brand-milk' />
									<div className='text-sm flex flex-col'>
										<span className='font-bold text-brand-milk'>
											Высшее образование
										</span>
										<span className='text-brand-milk/50'>СПбГАСУ</span>
									</div>
								</div>
								<div className='w-fit flex gap-5 items-center rounded-md bg-neutral-900 p-1 py-2 pr-5'>
									<Certificate size={20} className='ml-4 text-brand-milk' />
									<div className='text-sm flex flex-col'>
										<span className='font-bold text-brand-milk'>
											Курсы повышения квалификации
										</span>
										<span className='text-brand-milk/50'>marso.academy</span>
									</div>
								</div>
							</div>

							<Link
								href='/about'
								className={cn(
									buttonVariants({ variant: 'default', size: 'lg' }),
									'h-12 w-fit px-5 text-sm',
									'bg-brand-terracota-accent text-brand-milk',
									'transition-colors duration-300 hover:bg-brand-terracota',
								)}
							>
								О подходе студии
							</Link>
						</div>
					</div>
				</div>
			</SiteContainer>
		</SiteSection>
	)
}
