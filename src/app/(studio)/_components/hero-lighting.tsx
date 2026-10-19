'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

export type HeroSceneId = 'day' | 'pendants' | 'chandelier' | 'stone' | 'lamp'

export type HeroScene = {
	id: HeroSceneId
	label: string
	src: string
}

export type HeroHotspot = {
	id: string
	sceneId: HeroSceneId
	label: string
	x: number
	y: number
}

type HeroLightingProps = {
	scenes: readonly HeroScene[]
	hotspots: readonly HeroHotspot[]
}

export function HeroLighting({ scenes, hotspots }: HeroLightingProps) {
	const [selectedScene, setSelectedScene] = useState<HeroSceneId>('day')

	const [visibleScene, setVisibleScene] = useState<HeroSceneId>('day')

	const [selectedHotspot, setSelectedHotspot] = useState<string | null>(
		'window',
	)

	const [loadAlternates, setLoadAlternates] = useState(false)

	const [failedScene, setFailedScene] = useState<HeroSceneId | null>(null)

	const requestedScene = useRef<HeroSceneId>('day')
	const loadedScenes = useRef(new Set<HeroSceneId>())

	const selectScene = (sceneId: HeroSceneId, hotspotId: string | null) => {
		requestedScene.current = sceneId

		setSelectedScene(sceneId)
		setSelectedHotspot(hotspotId)
		setFailedScene(null)

		if (loadedScenes.current.has(sceneId)) {
			setVisibleScene(sceneId)
		}
	}

	const handleImageLoad = (sceneId: HeroSceneId) => {
		loadedScenes.current.add(sceneId)

		if (sceneId === 'day') {
			setLoadAlternates(true)
		}

		if (requestedScene.current === sceneId) {
			setVisibleScene(sceneId)
		}
	}

	const handleImageError = (sceneId: HeroSceneId) => {
		if (requestedScene.current === sceneId) {
			setFailedScene(sceneId)
		}
	}

	const displayedLabel = scenes.find(
		(scene) => scene.id === visibleScene,
	)?.label

	return (
		<section
			aria-label='Интерактивные сценарии освещения'
			className='relative isolate h-dvh w-full overflow-hidden bg-brand-charcoal'
		>
			{/* Общая координатная плоскость для кадров и точек */}
			<div
				className={cn(
					'pointer-events-none absolute',
					'top-1/2 left-1/2',
					'aspect-4/3 w-[max(100%,133.333dvh)]',
					'-translate-x-1/2 -translate-y-1/2',
				)}
			>
				{/* Кадры размещаются точно один поверх другого */}
				{scenes.map((scene, index) => {
					if (index !== 0 && !loadAlternates) {
						return null
					}

					return (
						<Image
							key={scene.id}
							src={scene.src}
							alt=''
							fill
							preload={index === 0}
							loading={index === 0 ? undefined : 'lazy'}
							sizes='(min-aspect-ratio: 4/3) 100vw, 133.333dvh'
							onLoad={() => handleImageLoad(scene.id)}
							onError={() => handleImageError(scene.id)}
							className={cn(
								'absolute inset-0 object-cover',
								'transition-opacity duration-700 ease-in-out',
								'motion-reduce:transition-none',
								scene.id === visibleScene ? 'opacity-100' : 'opacity-0',
							)}
						/>
					)
				})}

				{/* Точки привязаны к исходному изображению */}
				<div className='pointer-events-auto absolute inset-0 hidden lg:block'>
					{hotspots.map((hotspot) => {
						const isSelected = hotspot.id === selectedHotspot

						return (
							<button
								key={hotspot.id}
								type='button'
								aria-label={hotspot.label}
								aria-pressed={isSelected}
								title={hotspot.label}
								onClick={() => selectScene(hotspot.sceneId, hotspot.id)}
								style={{
									left: `${hotspot.x}%`,
									top: `${hotspot.y}%`,
								}}
								className={cn(
									'absolute z-10 grid size-11',
									'-translate-x-1/2 -translate-y-1/2',
									'cursor-pointer place-items-center rounded-full',
									'focus-visible:outline-2',
									'focus-visible:outline-offset-2',
									'focus-visible:outline-white',
								)}
							>
								<span
									className={cn(
										'grid size-8 place-items-center rounded-full',
										'border border-white/80 bg-black/25',
										'backdrop-blur-sm transition-colors duration-300',
										isSelected &&
											'border-brand-terracota-accent bg-brand-terracota-accent/80',
									)}
								>
									<span
										className={cn(
											'size-1.5 rounded-full',
											isSelected ? 'bg-brand-milk' : 'bg-white',
										)}
									/>
								</span>
							</button>
						)
					})}
				</div>
			</div>

			{/* Для мобильных */}
			<div
				className={cn(
					'absolute inset-x-4 bottom-8 z-20',
					'flex flex-wrap justify-center gap-2 lg:hidden',
				)}
				role='group'
				aria-label='Выбор освещения'
			>
				{scenes.map((scene) => (
					<button
						key={scene.id}
						type='button'
						aria-pressed={selectedScene === scene.id}
						onClick={() =>
							selectScene(
								scene.id,
								hotspots.find((hotspot) => hotspot.sceneId === scene.id)?.id ??
									null,
							)
						}
						className={cn(
							'rounded-full px-3 py-2 text-xs',
							'backdrop-blur-md transition-colors',
							'focus-visible:outline-2 focus-visible:outline-white',
							selectedScene === scene.id
								? 'bg-brand-terracota-accent text-white'
								: 'bg-black/65 text-white',
						)}
					>
						{scene.label}
					</button>
				))}
			</div>

			<p className='sr-only' aria-live='polite'>
				Текущий режим: {displayedLabel}
			</p>

			{failedScene && (
				<p
					role='alert'
					className={cn(
						'absolute right-4 bottom-24 left-4 z-20',
						'text-center text-sm text-white',
					)}
				>
					Не удалось загрузить выбранный сценарий освещения.
				</p>
			)}
		</section>
	)
}
