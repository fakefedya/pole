import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

export function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<SiteHeader />
			<main className='min-h-full'>{children}</main>
			<SiteFooter />
		</>
	)
}

export { SiteLayout as default }
