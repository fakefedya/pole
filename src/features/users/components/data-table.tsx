'use client'

import { useMemo } from 'react'
import { DashboardDataTable } from '@/features/dashboard/components/dashboard-data-table'
import { userColumns } from './columns'
import { userSearchText, USERS_PAGE_SIZE } from './data-table-features'
import type { ManagedUser } from './types'

type UsersDataTableProps = {
	users: ManagedUser[]
	actorId: string
	onManage: (id: string) => void
}

export function UsersDataTable({
	users,
	actorId,
	onManage,
}: UsersDataTableProps) {
	const columns = useMemo(
		() => userColumns(actorId, onManage),
		[actorId, onManage],
	)

	return (
		<DashboardDataTable
			rows={users}
			columns={columns}
			searchText={userSearchText}
			searchPlaceholder='Имя, email или роль…'
			emptyMessage='Пользователи не найдены'
			pageSize={USERS_PAGE_SIZE}
		/>
	)
}
