import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const boundedSans = localFont({
	src: './fonts/bounded-variable.ttf',
	variable: '--font-bounded-sans',
	display: 'swap',
})

const velaSans = localFont({
	src: './fonts/velaSans-variable.ttf',
	variable: '--font-vela-sans',
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'STUDIO POLE',
	description: 'Студия дизайна интерьеров',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang='ru'
			className={`${boundedSans.variable} ${velaSans.variable} h-full antialiased`}
		>
			<body className='flex min-h-full flex-col'>{children}</body>
		</html>
	)
}
