import { getPublicImageUrl } from '@/lib/storage/public-image'

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
	return <HeroLighting scenes={scenes} hotspots={hotspots} />
}
