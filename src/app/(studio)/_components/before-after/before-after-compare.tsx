'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

const ReactCompareSlider = dynamic(
	() =>
		import('react-compare-slider').then((module) => module.ReactCompareSlider),
	{
		ssr: false,
		loading: () => (
			<div className='h-full w-full bg-brand-charcoal' aria-hidden='true' />
		),
	},
)

type BeforeAfterCompareProps = {
	beforeSrc: string
	afterSrc: string
}

const imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1400px'

export function BeforeAfterCompare({
	beforeSrc,
	afterSrc,
}: BeforeAfterCompareProps) {
	return (
		<div className='relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-brand-charcoal sm:aspect-5/4 lg:aspect-video'>
			<ReactCompareSlider
				aria-label='Сравнение интерьера до и после'
				defaultPosition={50}
				keyboardIncrement='5%'
				changePositionOnHover={false}
				style={{ width: '100%', height: '100%' }}
				itemOne={
					<div className='relative h-full w-full'>
						<Image
							src={beforeSrc}
							alt='Интерьер до преобразования'
							fill
							sizes={imageSizes}
							className='object-cover'
						/>
					</div>
				}
				itemTwo={
					<div className='relative h-full w-full'>
						<Image
							src={afterSrc}
							alt='Тот же интерьер после преобразования'
							fill
							sizes={imageSizes}
							className='object-cover'
						/>
					</div>
				}
			/>

			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-4 top-4 z-10 flex justify-between sm:inset-x-6 sm:top-6'
			>
				<span className='rounded-full border border-brand-milk/20 bg-black/35 px-4 py-2 text-lg font-medium text-brand-milk backdrop-blur-md'>
					Визуализация
				</span>

				<span className='rounded-full border border-brand-milk/20 bg-black/35 px-4 py-2 text-lg font-medium text-brand-milk backdrop-blur-md'>
					Реализация
				</span>
			</div>
		</div>
	)
}
