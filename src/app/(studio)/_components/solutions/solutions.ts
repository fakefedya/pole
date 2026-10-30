import { InternalHref } from '@/config/site-navigation'
import { getPublicImageUrl } from '@/lib/storage/public-image'

type SolutionAction = {
	label: string
	href: InternalHref
	bgColor: string
	textColor: string
}

type SolutionImage = {
	src: string
	alt: string
}

type Solution = {
	title: string
	options: string[]
	description: string
	action: SolutionAction
	images: SolutionImage[]
}

export const solutions = [
	{
		title: 'Индивидуальный дизайн',
		options: ['Планировка', 'Проект', 'Сопровождение'],
		description:
			'Планировочное решение, полный дизайн-проект, авторское сопровождение и комплектация. Можно выбрать отдельную услугу или пройти путь от первых идей до реализации.',
		action: {
			label: 'Выбрать направление',
			href: '/',
			bgColor: 'bg-brand-milk',
			textColor: 'text-brand-charcoal',
		},
		images: [
			{
				src: getPublicImageUrl('site/home/solutions/individual-1.jpg'),
				alt: 'Индивидуальный дизайн кухни',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-2.jpg'),
				alt: 'Индивидуальный дизайн гостиной',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-3.jpg'),
				alt: 'Индивидуальный дизайн спальни',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-4.jpg'),
				alt: 'Индивидуальный дизайн детской',
			},
		],
	},
	{
		title: 'Паспорт интерьера',
		options: ['Для комнаты', 'Для квартиры'],
		description:
			'Собираем ваши предпочтения в персональную инструкцию: палитра, материалы, мебель и правила сочетаний. Ориентиры для самостоятельного обустройства дома.',
		action: {
			label: 'Как устроен паспорт',
			href: '/',
			bgColor: 'bg-brand-charcoal',
			textColor: 'text-brand-milk',
		},
		images: [
			{
				src: getPublicImageUrl('site/home/solutions/individual-1.jpg'),
				alt: 'Индивидуальный дизайн кухни',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-2.jpg'),
				alt: 'Индивидуальный дизайн гостиной',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-3.jpg'),
				alt: 'Индивидуальный дизайн спальни',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-4.jpg'),
				alt: 'Индивидуальный дизайн детской',
			},
		],
	},
	{
		title: 'Готовые решения',
		options: ['Готовые проекты', 'Шопинг-капсулы'],
		description:
			'Готовый интерьер для подходящей планировки или шопинг-капсула мебели и декора. Выберите уже разработанное интерьерное решение.',
		action: {
			label: 'Выбрать решение',
			href: '/',
			bgColor: 'bg-brand-milk',
			textColor: 'text-brand-charcoal',
		},
		images: [
			{
				src: getPublicImageUrl('site/home/solutions/ready-1.jpg'),
				alt: 'Готовые решения для гостиной',
			},
			{
				src: getPublicImageUrl('site/home/solutions/ready-2.jpg'),
				alt: 'Готовые решения для кухни',
			},
			{
				src: getPublicImageUrl('site/home/solutions/ready-3.jpg'),
				alt: 'Готовые решения для спальни',
			},
			{
				src: getPublicImageUrl('site/home/solutions/ready-4.jpg'),
				alt: 'Готовые решения для спальни альтернатива',
			},
		],
	},
	{
		title: 'Полезные материалы',
		options: ['Чек-листы', 'Таблицы', 'Инструкции'],
		description:
			'Чек-листы, таблицы и инструкции для ремонта и обустройства дома. Помогают упорядочить решения и покупки.',
		action: {
			label: 'Открыть материалы',
			href: '/',
			bgColor: 'bg-brand-milk',
			textColor: 'text-brand-charcoal',
		},
		images: [
			{
				src: getPublicImageUrl('site/home/solutions/individual-1.jpg'),
				alt: 'Индивидуальный дизайн кухни',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-2.jpg'),
				alt: 'Индивидуальный дизайн гостиной',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-3.jpg'),
				alt: 'Индивидуальный дизайн спальни',
			},
			{
				src: getPublicImageUrl('site/home/solutions/individual-4.jpg'),
				alt: 'Индивидуальный дизайн детской',
			},
		],
	},
] satisfies readonly Solution[]

export const solutionThemes = [
	'bg-brand-olive text-brand-milk',
	'bg-brand-milk text-brand-charcoal',
	'bg-brand-terracota text-brand-milk',
	'bg-brand-espresso text-brand-milk',
] as const
