'use client'

import Image from 'next/image'
import { ReactCompareSlider } from 'react-compare-slider'

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
		<div className='relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-brand-espresso sm:aspect-5/4 lg:aspect-video'>
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

			{/* Labels are decorative: the images and slider already have accessible names. */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-4 top-4 z-10 flex justify-between sm:inset-x-6 sm:top-6'
			>
				<span className='rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md'>
					Визуализация
				</span>
				<span className='rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md'>
					Реализация
				</span>
			</div>
		</div>
	)
}
