type InternalHref = `/${string}`

type NavigationLink = {
	type: 'link'
	label: string
	href: InternalHref
	isVisible?: boolean
}

type NavigationDropdownItem = {
	label: string
	href: InternalHref
	cover?: string
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
		label: 'Услуги и продукты',
		items: [
			{
				label: 'Индивидуальные услуги',
				href: '/individual',
				cover: 'coverIndividual',
			},
			{
				label: 'Паспорт интерьерного стиля',
				href: '/passport',
				cover: 'coverPassport',
			},
			{
				label: 'Готовые решения',
				href: '/ready',
				cover: 'coverReady',
			},
			{
				label: 'Полезные материалы',
				href: '/materials',
				cover: 'coverMaterials',
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
