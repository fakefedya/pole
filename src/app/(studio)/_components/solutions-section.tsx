import { SiteContainer } from '@/components/layout/site-container'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const solutions = [
	{
		title: 'Индивидуальный дизайн',
		options: ['Планировка', 'Проект', 'Сопровождение'],
		description:
			'Планировочное решение, полный дизайн-проект, авторское сопровождение и комплектация. Можно выбрать отдельную услугу или пройти путь от первых идей до реализации.',
		action: {
			label: 'Выбрать направление',
			href: '/',
			style: 'bg-brand-olive',
		},
	},
	{
		title: 'Паспорт интерьера',
		options: ['Для комнаты', 'Для квартиры'],
		description:
			'Собираем ваши предпочтения в персональную инструкцию: палитра, материалы, мебель и правила сочетаний. Ориентиры для самостоятельного обустройства дома.',
		action: {
			label: 'Как устроен паспорт',
			href: '/',
			style: 'bg-brand-olive',
		},
	},
	{
		title: 'Готовые решения',
		options: ['Готовые проекты', 'Шопинг-капсулы'],
		description:
			'Готовый интерьер для подходящей планировки или шопинг-капсула мебели и декора. Выберите уже разработанное интерьерное решение.',
		action: {
			label: 'Выбрать решение',
			href: '/',
			style: 'bg-brand-olive',
		},
	},
	{
		title: 'Полезные материалы',
		options: ['Чек-листы', 'Таблицы', 'Инструкции'],
		description:
			'Чек-листы, таблицы и инструкции для ремонта и обустройства дома. Помогают упорядочить решения и покупки.',
		action: {
			label: 'Открыть материалы',
			href: '/',
			style: 'bg-brand-olive',
		},
	},
]

const solutionThemes = [
	'bg-brand-olive text-brand-milk',
	'bg-brand-milk text-brand-charcoal',
	'bg-brand-terracota text-brand-milk',
	'bg-brand-espresso text-brand-milk',
] as const

export function SolutionsSection() {
	return (
		<section aria-label='Решения STUDIO POLE' className='relative isolate'>
			{solutions.map((solution, index) => (
				<article
					key={solution.title}
					style={{ zIndex: index + 1 }}
					className={cn(
						'relative flex min-h-dvh w-full flex-col items-center',
						'px-5 py-20 md:p-10',
						'md:sticky md:top-0 md:h-dvh',
						solutionThemes[index % solutionThemes.length],
					)}
				>
					<SiteContainer>
						<div className='flex flex-col gap-8'>
							<div className='flex flex-col gap-3'>
								<span className='text-sm opacity-60'>
									{String(index + 1).padStart(2, '0')}
									{' / '}
									{String(solutions.length).padStart(2, '0')}
								</span>

								<h2 className='font-display text-4xl md:text-6xl'>
									{solution.title}
								</h2>
							</div>

							{/* Варианты услуг */}
							<div className='flex flex-wrap gap-2'>
								{solution.options.map((option) => (
									<span
										key={option}
										className='rounded-full border border-current/25 px-4 py-2 text-sm'
									>
										{option}
									</span>
								))}
							</div>

							{/* Описание */}
							<p className='max-w-2xl text-lg leading-relaxed'>
								{solution.description}
							</p>

							{/* CTA */}
							<div>
								<Link
									href={solution.action.href}
									className={cn(
										'inline-flex items-center justify-center',
										'rounded-full px-6 py-3',
										'text-sm font-medium text-white',
										'transition-opacity hover:opacity-80',
										solution.action.style,
									)}
								>
									{solution.action.label}
								</Link>
							</div>
						</div>
					</SiteContainer>
				</article>
			))}
		</section>
	)
}
