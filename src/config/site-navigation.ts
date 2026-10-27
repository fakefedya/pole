type InternalHref = `/${string}`

type NavigationLink = {
	type: 'link'
	label: string
	href: InternalHref
	isVisible?: boolean
}

type NavigationDropdownItem = {
	label: string
	description: string
	href: InternalHref
	cover: string
	isVisible?: boolean
}

type NavigationDropdown = {
	type: 'dropdown'
	label: string
	items: readonly NavigationDropdownItem[]
	isVisible?: boolean
}

export type SiteNavigationItem = NavigationLink | NavigationDropdown

export const siteNavigation = [
	{
		type: 'link',
		label: 'Главная',
		href: '/',
	},
	{
		type: 'dropdown',
		label: 'Услуги',
		items: [
			{
				label: 'Индивидуальные услуги',
				description: 'Проектирование и сопровождение вашего интерьера.',
				href: '/individual',
				cover: 'nav-cover-individual.svg',
			},
			{
				label: 'Паспорт интерьерного стиля',
				description: 'Ваши предпочтения — в инструкции по обустройству дома.',
				href: '/passport',
				cover: 'nav-cover-passport.svg',
			},
			{
				label: 'Готовые решения',
				description: 'Готовые проекты и подборки мебели и декора.',
				href: '/ready',
				cover: 'nav-cover-ready.svg',
			},
			{
				label: 'Полезные материалы',
				description: 'Чек-листы, таблицы и инструкции для дома.',
				href: '/materials',
				cover: 'nav-cover-materials.svg',
			},
		],
	},
	{
		type: 'link',
		label: 'Проекты',
		href: '/projects',
	},
	{
		type: 'link',
		label: 'О студии',
		href: '/about',
	},
	{
		type: 'link',
		label: 'Цены',
		href: '/prices',
	},
	{
		type: 'link',
		label: 'Контакты',
		href: '/contacts',
	},
] as const satisfies readonly SiteNavigationItem[]
