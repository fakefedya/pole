'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react'

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export type DashboardColumn<T> = {
	id: string
	header: string
	cell: (item: T) => ReactNode
	sortValue?: (item: T) => string | number
	className?: string
}

type DashboardDataTableProps<T extends { id: string }> = {
	rows: T[]
	columns: DashboardColumn<T>[]
	searchText: (item: T) => string
	searchPlaceholder?: string
	emptyMessage?: string
	pageSize?: number
}

export function DashboardDataTable<T extends { id: string }>({
	rows,
	columns,
	searchText,
	searchPlaceholder = 'Поиск…',
	emptyMessage = 'Нет записей',
	pageSize = 10,
}: DashboardDataTableProps<T>) {
	const [query, setQuery] = useState('')
	const [sort, setSort] = useState<{ id: string; descending: boolean } | null>(
		null,
	)
	const [requestedPage, setRequestedPage] = useState(0)

	const filtered = useMemo(() => {
		const term = query.trim().toLocaleLowerCase('ru-RU')
		const matching = term
			? rows.filter((item) =>
					searchText(item).toLocaleLowerCase('ru-RU').includes(term),
				)
			: rows

		if (!sort) return matching
		const col = columns.find((column) => column.id === sort.id)
		if (!col?.sortValue) return matching

		return [...matching].sort((left, right) => {
			const a = col.sortValue!(left)
			const b = col.sortValue!(right)
			const order =
				typeof a === 'number' && typeof b === 'number'
					? a - b
					: String(a).localeCompare(String(b), 'ru-RU', { numeric: true })
			return sort.descending ? -order : order
		})
	}, [rows, columns, query, searchText, sort])

	const size = Math.max(1, pageSize)
	const totalPages = Math.max(1, Math.ceil(filtered.length / size))
	const page = Math.min(requestedPage, totalPages - 1)
	const visibleRows = filtered.slice(page * size, (page + 1) * size)

	// Keep at most five numbered pages on screen (with boundary and ellipses).
	const startPage = Math.max(0, Math.min(page - 2, totalPages - 5))
	const endPage = Math.min(totalPages - 1, startPage + 4)
	const numberedPages = Array.from(
		{ length: endPage - startPage + 1 },
		(_, index) => startPage + index,
	)

	const goToPage = (nextPage: number) => {
		setRequestedPage(Math.max(0, Math.min(totalPages - 1, nextPage)))
	}

	function toggleSort(id: string) {
		setSort((current) =>
			current?.id === id
				? { id, descending: !current.descending }
				: { id, descending: false },
		)
		setRequestedPage(0)
	}

	return (
		<section className='space-y-4' aria-label='Таблица записей'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<div className='relative w-full max-w-xs'>
					<Search
						aria-hidden='true'
						className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-milk'
					/>
					<Input
						value={query}
						onChange={(event) => {
							setQuery(event.target.value)
							setRequestedPage(0)
						}}
						aria-label='Поиск по таблице'
						placeholder={searchPlaceholder}
						className='pl-9 bg-dashboard-input text-brand-milk font-medium placeholder:text-muted-foreground placeholder:font-medium rounded-lg border border-dashboard-input-border'
					/>
				</div>
			</div>

			<div className='overflow-hidden rounded-lg border border-dashboard-border'>
				<Table>
					<TableHeader>
						<TableRow className='hover:bg-dashboard-background transition-colors duration-300 text-brand-milk border-b-dashboard-border'>
							{columns.map((column) => (
								<TableHead
									key={column.id}
									className={cn(
										'text-brand-milk h-10 font-semibold ',
										column.className,
									)}
									aria-sort={
										!column.sortValue || sort?.id !== column.id
											? 'none'
											: sort.descending
												? 'descending'
												: 'ascending'
									}
								>
									{column.sortValue ? (
										<button
											type='button'
											onClick={() => toggleSort(column.id)}
											className='flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#1F1F1F]'
										>
											{column.header}
											{sort?.id !== column.id ? (
												<ArrowUpDown size={16} aria-hidden='true' />
											) : sort.descending ? (
												<ArrowDown size={16} aria-hidden='true' />
											) : (
												<ArrowUp size={16} aria-hidden='true' />
											)}
										</button>
									) : (
										column.header
									)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{visibleRows.length ? (
							visibleRows.map((item) => (
								<TableRow
									key={item.id}
									className='hover:bg-brand-charcoal border-b-dashboard-border'
								>
									{columns.map((column) => (
										<TableCell className={column.className} key={column.id}>
											{column.cell(item)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='py-12 text-center text-muted-foreground'
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex flex-wrap items-center justify-between gap-3 text-sm'>
				<p className='text-xs text-muted-foreground'>
					{filtered.length === 0
						? 'Нет результатов'
						: `${page * size + 1}–${Math.min((page + 1) * size, filtered.length)} из ${filtered.length}`}
				</p>
				{totalPages > 1 && (
					<Pagination className='w-auto'>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href='#'
									aria-disabled={page === 0}
									tabIndex={page === 0 ? -1 : undefined}
									className={
										page === 0 ? 'pointer-events-none opacity-40' : undefined
									}
									onClick={(event) => {
										event.preventDefault()
										if (page > 0) goToPage(page - 1)
									}}
								/>
							</PaginationItem>
							{startPage > 0 && (
								<>
									<PaginationItem>
										<PaginationLink
											href='#'
											onClick={(event) => {
												event.preventDefault()
												goToPage(0)
											}}
										>
											1
										</PaginationLink>
									</PaginationItem>
									{startPage > 1 && (
										<PaginationItem>
											<PaginationEllipsis />
										</PaginationItem>
									)}
								</>
							)}
							{numberedPages.map((index) => (
								<PaginationItem key={index}>
									<PaginationLink
										href='#'
										isActive={page === index}
										onClick={(event) => {
											event.preventDefault()
											goToPage(index)
										}}
									>
										{index + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							{endPage < totalPages - 1 && (
								<>
									{endPage < totalPages - 2 && (
										<PaginationItem>
											<PaginationEllipsis />
										</PaginationItem>
									)}
									<PaginationItem>
										<PaginationLink
											href='#'
											onClick={(event) => {
												event.preventDefault()
												goToPage(totalPages - 1)
											}}
										>
											{totalPages}
										</PaginationLink>
									</PaginationItem>
								</>
							)}
							<PaginationItem>
								<PaginationNext
									href='#'
									aria-disabled={page === totalPages - 1}
									tabIndex={page === totalPages - 1 ? -1 : undefined}
									className={
										page === totalPages - 1
											? 'pointer-events-none opacity-40'
											: undefined
									}
									onClick={(event) => {
										event.preventDefault()
										if (page + 1 < totalPages) goToPage(page + 1)
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}
			</div>
		</section>
	)
}
