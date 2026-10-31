import { Suspense } from 'react'
import 'lenis/dist/lenis.css'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteSmoothScroll } from '@/components/layout/site-smooth-scroll'

export function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<SiteSmoothScroll>
			<Suspense fallback={null}>
				<SiteHeader />
			</Suspense>

			<main className='min-h-full bg-brand-black'>{children}</main>

			<SiteFooter />
		</SiteSmoothScroll>
	)
}

export { SiteLayout as default }
