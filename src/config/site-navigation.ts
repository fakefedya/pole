type Link = {
	isActive: boolean
	type: 'link'
	label: string
	href: string
}

type Dropdown = {
	isActive: boolean
	type: 'dropdown'
	label: string
	items: DropdownItem[]
}

type DropdownItem = {
	isActive: boolean
	label: string
	href: string
	cover: string
}

export type SiteNavigationItem = Link | Dropdown

export const siteNavigation: SiteNavigationItem[] = [
	{
		isActive: true,
		type: 'link',
		label: 'Главная',
		href: '/',
	},
	{
		isActive: true,
		type: 'dropdown',
		label: 'Услуги и продукты',
		items: [
			{
				isActive: true,
				label: 'Индивидуальные услуги',
				href: '/individual',
				cover: 'coverIndividual',
			},
			{
				isActive: true,
				label: 'Паспорт интерьерного стиля',
				href: '/passport',
				cover: 'coverPassport',
			},
			{
				isActive: true,
				label: 'Готовые решения',
				href: '/ready',
				cover: 'coverReady',
			},
			{
				isActive: true,
				label: 'Полезные материалы',
				href: '/materials',
				cover: 'coverMaterials',
			},
		],
	},
]
