import { cn } from '@/lib/utils'
import { SiteContainer } from './site-container'
import { siteNavigation } from '@/config/site-navigation'

export function SiteFooter() {
	const footerNavigation = siteNavigation.filter((el) => el.type === 'link')
	const footerSolutions = siteNavigation.filter((el) => el.type === 'dropdown')

	return (
		<footer className='bg-brand-terracota'>
			<SiteContainer className='p-10'>
				<div className='grid grid-cols-12'>
					<div className={cn('col-span-12', 'lg:col-span-6')}>132</div>
					<div className={cn('col-span-12 grid grid-cols-12', 'lg:col-span-6')}>
						<div className='flex shrink-0 flex-col gap-y-4 col-span-12 sm:col-span-6'>
							<nav className='flex flex-col'>
								{footerNavigation.map((link) => (
									<div key={link.label} className=''>
										{link.label}
									</div>
								))}
							</nav>
						</div>
						<div className='flex shrink-0 flex-col gap-y-4 col-span-12 sm:col-span-6'>
							<nav className='flex flex-col'>
								{footerSolutions.map((el) =>
									el.items.map((item) => (
										<div key={item.label} className=''>
											{item.label}
										</div>
									)),
								)}
							</nav>
						</div>
					</div>
				</div>
			</SiteContainer>
		</footer>
	)
}
