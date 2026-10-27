export type ProjectTableRow = {
	id: string
	title: string
	slug: string
	status: 'DRAFT' | 'HIDDEN' | 'PUBLISHED'
	areaSqM: string | null
	location: string | null
	tags: string[]
	updatedAt: string
	showOnHome: boolean
	imageCount: number
	coverUrl: string | null
}
