import { getPublicImageUrl } from '@/lib/storage/public-image'
import Image from 'next/image'

import { HeroLighting, type HeroHotspot, type HeroScene } from './hero-lighting'

const scenes = [
	{
		id: 'day',
		label: 'Дневной свет',
		src: getPublicImageUrl('site/home/hero/day.jpg'),
	},
	{
		id: 'pendants',
		label: 'Подвесные светильники',
		src: getPublicImageUrl('site/home/hero/pendants.jpg'),
	},
	{
		id: 'chandelier',
		label: 'Люстра',
		src: getPublicImageUrl('site/home/hero/chandelier.jpg'),
	},
	{
		id: 'stone',
		label: 'Подсветка камня',
		src: getPublicImageUrl('site/home/hero/stone.jpg'),
	},
	{
		id: 'lamp',
		label: 'Подсветка потолка',
		src: getPublicImageUrl('site/home/hero/lamp.jpg'),
	},
] satisfies readonly HeroScene[]

const hotspots = [
	{
		id: 'window',
		sceneId: 'day',
		label: 'Естественное освещение',
		x: 7.6,
		y: 47,
	},
	{
		id: 'left-pendant',
		sceneId: 'pendants',
		label: 'Включить подвесные светильники',
		x: 77,
		y: 45,
	},
	{
		id: 'stone',
		sceneId: 'stone',
		label: 'Включить подсветку камня',
		x: 31.4,
		y: 52,
	},
	{
		id: 'chandelier',
		sceneId: 'chandelier',
		label: 'Включить люстру',
		x: 59.4,
		y: 32,
	},
	{
		id: 'lamp',
		sceneId: 'lamp',
		label: 'Включить подсветку потолка',
		x: 70,
		y: 26,
	},
] satisfies readonly HeroHotspot[]

export function HeroSection() {
	return (
		<HeroLighting scenes={scenes} hotspots={hotspots}>
			<div className='absolute top-7.5 left-7.5 z-5 block'>
				<Image
					src='/brand/logo-icon.svg'
					alt='STUDIO POLE'
					width={64}
					height={64}
				/>
			</div>
			<div
				aria-hidden='true'
				className=' pointer-events-none absolute top-1/2 right-7.5 z-5 h-[80dvh] w-[20dvh] -translate-y-1/2'
			>
				<Image
					src='/brand/logo-pole.svg'
					alt=''
					width={456}
					height={114}
					className='absolute top-full left-0 h-auto w-[400%] max-w-none origin-top-left -rotate-90 opacity-80'
				/>
			</div>
		</HeroLighting>
	)
}
