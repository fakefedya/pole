import { Suspense } from 'react'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

export function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Suspense fallback={null}>
				<SiteHeader />
			</Suspense>

			<main className='min-h-full bg-brand-charcoal'>{children}</main>

			<SiteFooter />
		</>
	)
}

export { SiteLayout as default }
