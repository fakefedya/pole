import { getPublicImageUrl } from '@/lib/storage/public-image'
import { HeroHotspot, HeroScene } from './hero-lighting'

export const scenes = [
	{
		id: 'pendants',
		label: 'Подвесные светильники',
		src: getPublicImageUrl('site/home/hero/pendants.jpg'),
	},
	{
		id: 'day',
		label: 'Дневной свет',
		src: getPublicImageUrl('site/home/hero/day.jpg'),
	},
	{
		id: 'stone',
		label: 'Подсветка камня',
		src: getPublicImageUrl('site/home/hero/stone.jpg'),
	},
	{
		id: 'chandelier',
		label: 'Люстра',
		src: getPublicImageUrl('site/home/hero/chandelier.jpg'),
	},
] satisfies readonly HeroScene[]

export const hotspots = [
	{
		id: 'pendant',
		sceneId: 'pendants',
		label: 'Включить подвесные светильники',
		x: 77.3,
		y: 45,
	},
	{
		id: 'window',
		sceneId: 'day',
		label: 'Естественное освещение',
		x: 12,
		y: 45,
	},
	{
		id: 'stone',
		sceneId: 'stone',
		label: 'Включить подсветку камня',
		x: 36,
		y: 45,
	},
	{
		id: 'chandelier',
		sceneId: 'chandelier',
		label: 'Включить люстру',
		x: 57,
		y: 30,
	},
] satisfies readonly HeroHotspot[]
