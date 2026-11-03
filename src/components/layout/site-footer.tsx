import { cn } from '@/lib/utils'
import { SiteContainer } from './site-container'

export function SiteFooter() {
	return (
		<footer className='bg-brand-terracota'>
			<SiteContainer className='p-10'>
				<div className='grid grid-cols-12'>
					<div className={cn('col-span-12', 'lg:col-span-6')}>132</div>
					<div className={cn('col-span-12 grid grid-cols-12', 'lg:col-span-6')}>
						132
					</div>
				</div>
			</SiteContainer>
		</footer>
	)
}
