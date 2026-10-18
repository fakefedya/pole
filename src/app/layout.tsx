import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
			className={cn("h-full", "antialiased", boundedSans.variable, velaSans.variable, "font-sans", inter.variable)}
		>
			<body className='flex min-h-full flex-col'>{children}</body>
		</html>
	)
}
