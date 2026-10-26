import { z } from 'zod'

export const projectFormSchema = z.object({
	title: z.string().trim().min(2, 'Укажите название (от 2 символов)').max(180),
	slug: z
		.string()
		.trim()
		.min(2, 'Укажите URL-адрес: минимум 2 символа')
		.max(160, 'URL-адрес слишком длинный')
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Только латиница, цифры и дефисы'),
	summary: z.string().trim().max(320),
	tagsText: z
		.string()
		.max(600)
		.refine(
			(value) =>
				new Set(
					value
						.split(',')
						.map((tag) => tag.trim())
						.filter(Boolean),
				).size <= 20,
			'Не больше 20 разных тегов.',
		),
	location: z.string().trim().max(160),
	style: z.string().trim().max(120),
	designDuration: z.string().trim().max(100),
	year: z
		.string()
		.trim()
		.regex(/^$|^\d{4}$/, 'Год — четыре цифры'),
	areaSqM: z
		.string()
		.trim()
		.regex(/^$|^\d{1,5}([.,]\d{1,2})?$/, 'Введите площадь числом'),
	description: z.string().max(15000),
	status: z.enum(['DRAFT', 'HIDDEN', 'PUBLISHED']),
	showOnHome: z.boolean(),
	homeOrder: z.coerce.number().int().min(0).max(10000),
})
export type ProjectFormData = z.infer<typeof projectFormSchema>

export function parseProjectForm(formData: FormData) {
	return projectFormSchema.safeParse({
		title: formData.get('title'),
		slug: formData.get('slug'),
		summary: formData.get('summary') ?? '',
		tagsText: formData.get('tagsText') ?? '',
		location: formData.get('location') ?? '',
		style: formData.get('style') ?? '',
		designDuration: formData.get('designDuration') ?? '',
		year: formData.get('year') ?? '',
		areaSqM: formData.get('areaSqM') ?? '',
		description: formData.get('description') ?? '',
		status: formData.get('status'),
		showOnHome: formData.get('showOnHome') === 'on',
		homeOrder: formData.get('homeOrder') ?? '0',
	})
}

export function prepareProject(input: ProjectFormData) {
	return {
		title: input.title,
		slug: input.slug,
		summary: input.summary || null,
		tags: [
			...new Set(
				input.tagsText
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean),
			),
		].slice(0, 20),
		location: input.location || null,
		style: input.style || null,
		designDuration: input.designDuration || null,
		areaSqM: input.areaSqM ? input.areaSqM.replace(',', '.') : null,
		year: input.year ? Number(input.year) : null,
		status: input.status,
		showOnHome: input.showOnHome,
		homeOrder: input.homeOrder,
	}
}

/** Serialize structured blocks for a plain-text editor without losing headings. */
export function blocksToDescription(
	blocks: readonly { type: 'HEADING' | 'PARAGRAPH'; body: string }[],
): string {
	return blocks
		.map((block) =>
			block.type === 'HEADING' ? `## ${block.body}` : block.body,
		)
		.join('\n\n')
}

/** `## Heading` on its own line creates a HEADING block; blank lines split blocks. */
export function descriptionToBlocks(description: string) {
	return description
		.split(/\n\s*\n/)
		.map((value) => value.trim())
		.filter(Boolean)
		.map((value, sortOrder) => {
			const match = /^##[ \t]+([^\n]+)$/.exec(value)
			if (match) {
				return { body: match[1].trim(), sortOrder, type: 'HEADING' as const }
			}
			return { body: value, sortOrder, type: 'PARAGRAPH' as const }
		})
}
