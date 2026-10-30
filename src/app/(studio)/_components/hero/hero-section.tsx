import Image from 'next/image'

import { HeroLighting } from './hero-lighting'
import { hotspots, scenes } from './hero-scenes'

export function HeroSection() {
	return (
		<HeroLighting scenes={scenes} hotspots={hotspots}>
			<div className='absolute top-7.5 left-7.5 z-5 block'>
				<Image
					src='/brand/logo-icon.png'
					alt='STUDIO POLE'
					width={64}
					height={64}
				/>
			</div>
		</HeroLighting>
	)
}
