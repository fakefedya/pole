import { cn } from '@/lib/utils'
import { SiteContainer } from './site-container'
import {
	siteNavigation,
	type SiteNavigationItem,
} from '@/config/site-navigation'
import Link from 'next/link'

type FooterLink = Extract<SiteNavigationItem, { type: 'link' }>
type FooterDropdown = Extract<SiteNavigationItem, { type: 'dropdown' }>

const footerNavigation = siteNavigation.filter(
	(el): el is FooterLink => el.type === 'link' && el.isVisible !== false,
)

const footerDropdown = siteNavigation.filter(
	(el): el is FooterDropdown =>
		el.type === 'dropdown' && el.isVisible !== false,
)
const currentYear = new Date().getFullYear()

export function SiteFooter() {
	return (
		<footer className='relative z-0 min-h-dvh bg-brand-terracota lg:sticky lg:bottom-0'>
			<SiteContainer className='mx-auto min-h-dvh gap-y-10 px-5 py-10 sm:px-8 lg:px-10 lg:py-12'>
				<div className='grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12'>
					<div className='lg:col-span-6'>
						{/* Услуги */}
						<div className='shrink-0 flex flex-col gap-y-4'>
							<span className='text-brand-milk/60 text-sm font-medium'>
								Услуги
							</span>
							<nav
								aria-label='Услуги студии'
								className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4'
							>
								{footerDropdown
									.filter((el) => el.label.toLowerCase() === 'услуги')
									.map((el) =>
										el.items
											.filter((item) => item.isVisible !== false)
											.map((item) => (
												<Link
													href={item.href}
													key={item.label}
													className={cn(
														'flex min-h-28 flex-col gap-y-4 rounded-lg bg-[#753214] p-4',
														'transition-colors duration-300 hover:bg-[#753214]/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-milk',
													)}
												>
													<span className='font-medium text-brand-milk text-sm'>
														{item.label}
													</span>
													{item.description && (
														<p className='text-sm text-brand-milk/60'>
															{item.description}
														</p>
													)}
												</Link>
											)),
									)}
							</nav>
						</div>
					</div>
					<div
						className={cn(
							'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2',
							'lg:col-span-5 lg:col-start-8',
						)}
					>
						{/* Навигация */}
						<div className='flex min-w-0 flex-col gap-y-4'>
							<span className='text-brand-milk/60 text-sm font-medium'>
								Навигация
							</span>
							<nav
								aria-label='Навигация сайта'
								className='flex flex-col gap-y-4'
							>
								{footerNavigation.map((link) => (
									<div
										key={link.label}
										className='relative flex items-center gap-x-2 text-brand-milk font-medium text-sm'
									>
										<Link
											href={link.href}
											className='group relative inline-flex w-fit items-center gap-x-1 font-button transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-milk'
										>
											{link.label}
											<span
												className='absolute -bottom-1 left-0 h-px w-full bg-current/20'
												aria-hidden='true'
											>
												<span className='group-hover:bg-brand-milk scale-x-0 group-hover:scale-x-100 transition-all duration-300 block size-full origin-left bg-current'></span>
											</span>
										</Link>
									</div>
								))}
							</nav>
						</div>
						{/* Политики */}
						<div className='flex min-w-0 flex-col gap-y-4'>
							<span className='text-brand-milk/60 text-sm font-medium'>
								Политики
							</span>
							<nav
								aria-label='Правовые документы'
								className='flex flex-col gap-y-4'
							>
								{footerDropdown
									.filter((el) => el.label.toLowerCase() === 'политики')
									.map((el) =>
										el.items
											.filter((item) => item.isVisible !== false)
											.map((item) => (
												<div
													key={item.label}
													className='relative flex items-center gap-x-2 text-brand-milk font-medium text-sm'
												>
													<Link
														href={item.href}
														className='group relative inline-flex w-fit items-center gap-x-1 font-button transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-milk'
													>
														{item.label}
														<span
															className='absolute -bottom-1 left-0 h-px w-full bg-current/20'
															aria-hidden='true'
														>
															<span className='group-hover:bg-red-100 scale-x-0 group-hover:scale-x-100 transition-all duration-300 block size-full origin-left bg-current'></span>
														</span>
													</Link>
												</div>
											)),
									)}
							</nav>
						</div>
					</div>
				</div>
				{/* Лого */}
				<div className='mt-auto flex flex-col gap-y-8 fill-brand-terracota-accent'>
					<svg
						aria-hidden='true'
						focusable='false'
						width='456'
						height='114'
						viewBox='0 0 456 114'
						fill='currentColor'
						xmlns='http://www.w3.org/2000/svg'
						className='h-auto w-full text-brand-terracota-accent'
					>
						<path d='M95.41 19.2C91.9659 13.7231 87 9.36886 81.12 6.67001C74.9467 3.69667 67.5866 2.21333 59.04 2.21999H3.10999C2.28516 2.21999 1.49413 2.5477 0.910889 3.13094C0.327651 3.71418 0 4.50522 0 5.33004V108.44C0 109.265 0.327651 110.056 0.910889 110.639C1.49413 111.222 2.28516 111.55 3.10999 111.55H19.78C20.6048 111.55 21.3958 111.222 21.9791 110.639C22.5623 110.056 22.89 109.265 22.89 108.44V73.36H59.04C67.5866 73.36 74.9467 71.8767 81.12 68.91C86.985 66.2213 91.9476 61.8942 95.41 56.45C98.704 50.7957 100.44 44.3689 100.44 37.825C100.44 31.2812 98.704 24.8544 95.41 19.2ZM72.16 49.89C68.76 52.7967 64.0467 54.2534 58.02 54.26H22.93V21.32H58.06C64.06 21.32 68.7733 22.8 72.2 25.76C75.6267 28.72 77.3267 32.72 77.3 37.76C77.2733 42.96 75.56 47.0034 72.16 49.89Z' />
						<path d='M173.32 113.74C160.687 113.74 149.61 111.357 140.09 106.59C130.936 102.163 123.227 95.227 117.86 86.59C112.573 78.0634 109.93 68.16 109.93 56.88C109.93 45.6 112.58 35.69 117.88 27.15C123.247 18.5131 130.956 11.5775 140.11 7.15002C149.63 2.38336 160.707 0 173.34 0C185.973 0 197.053 2.38336 206.58 7.15002C215.73 11.5835 223.438 18.5177 228.81 27.15C234.11 35.6967 236.76 45.6067 236.76 56.88C236.76 68.1533 234.11 78.0667 228.81 86.62C223.438 95.2523 215.73 102.187 206.58 106.62C197.047 111.36 185.96 113.733 173.32 113.74ZM173.32 93.18C181.58 93.18 188.7 91.7233 194.68 88.81C200.449 86.0851 205.29 81.7243 208.6 76.27C211.933 70.83 213.6 64.3667 213.6 56.88C213.6 49.3933 211.933 42.9333 208.6 37.5C205.287 32.048 200.447 27.6879 194.68 24.96C188.68 22.04 181.56 20.5834 173.32 20.59C165.16 20.59 158.067 22.0467 152.04 24.96C146.24 27.67 141.37 32.0324 138.04 37.5C134.707 42.94 133.04 49.4 133.04 56.88C133.04 64.36 134.707 70.8233 138.04 76.27C141.367 81.7399 146.238 86.1031 152.04 88.81C158.073 91.7233 165.167 93.18 173.32 93.18Z' />
						<path d='M382.8 47.85H448.23C448.73 47.8501 449.222 47.9689 449.667 48.1964C450.112 48.4239 450.497 48.7537 450.79 49.1587C451.083 49.5638 451.275 50.0325 451.352 50.5264C451.428 51.0204 451.387 51.5254 451.23 52L447.33 63.76C447.123 64.3911 446.721 64.9401 446.182 65.3283C445.643 65.7164 444.994 65.9236 444.33 65.92H382.8V89.2C382.8 90.0248 383.128 90.8159 383.711 91.3991C384.294 91.9824 385.085 92.31 385.91 92.31H452.03C452.526 92.3045 453.016 92.4172 453.459 92.6389C453.903 92.8605 454.287 93.1847 454.581 93.5845C454.874 93.9843 455.068 94.4482 455.146 94.9379C455.224 95.4275 455.184 95.9288 455.03 96.4L450.72 109.4C450.509 110.026 450.105 110.57 449.566 110.952C449.027 111.335 448.381 111.537 447.72 111.53H362.72C361.895 111.53 361.104 111.202 360.521 110.619C359.938 110.036 359.61 109.245 359.61 108.42V5.33003C359.61 4.50521 359.938 3.71417 360.521 3.13093C361.104 2.5477 361.895 2.21998 362.72 2.21998H452.72C453.217 2.21223 453.708 2.32352 454.153 2.54451C454.597 2.7655 454.983 3.08981 455.276 3.49025C455.57 3.89069 455.764 4.35563 455.841 4.8462C455.918 5.33678 455.877 5.83872 455.72 6.31001L451.41 19.31C451.202 19.938 450.798 20.4832 450.259 20.8662C449.719 21.2493 449.072 21.4503 448.41 21.44H385.93C385.522 21.44 385.117 21.5205 384.74 21.6768C384.362 21.8331 384.02 22.0621 383.731 22.3509C383.442 22.6397 383.213 22.9826 383.057 23.3599C382.9 23.7372 382.82 24.1416 382.82 24.55L382.8 47.85Z' />
						<path d='M344.87 91.29H280.37C279.545 91.29 278.754 90.9623 278.171 90.3791C277.588 89.7959 277.26 89.0048 277.26 88.18V6.56002C277.266 6.06421 277.153 5.57424 276.931 5.1307C276.71 4.68715 276.385 4.30281 275.986 4.00954C275.586 3.71628 275.122 3.52253 274.632 3.44436C274.142 3.36618 273.641 3.40583 273.17 3.56002L256.51 9.08004C255.879 9.28535 255.331 9.68751 254.946 10.2275C254.561 10.7675 254.359 11.4168 254.37 12.08V108.48C254.37 109.305 254.698 110.096 255.281 110.679C255.864 111.262 256.655 111.59 257.48 111.59H340.23C340.892 111.6 341.539 111.399 342.079 111.016C342.618 110.633 343.022 110.088 343.23 109.46L347.88 95.41C348.043 94.9362 348.089 94.43 348.014 93.9346C347.939 93.4392 347.746 92.9692 347.45 92.5646C347.154 92.16 346.766 91.8328 346.316 91.6109C345.867 91.389 345.371 91.2789 344.87 91.29Z' />
					</svg>
				</div>
				<div className='flex flex-wrap justify-between gap-2 text-sm text-brand-milk/60'>
					<span>© {currentYear} POLE</span>
					<span>Все права защищены</span>
				</div>
			</SiteContainer>
		</footer>
	)
}
