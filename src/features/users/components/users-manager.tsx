'use client'

import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DashboardPageHeader } from '@/features/dashboard/components/dashboard-page-header'
import { CreateUserSheet } from './create-user-sheet'
import { EditUserSheet } from './edit-user-sheet'
import { UsersDataTable } from './data-table'
import type { ManagedUser } from './types'

type UsersManagerProps = {
	users: ManagedUser[]
	actorId: string
}

export function UsersManager({ users, actorId }: UsersManagerProps) {
	const [createOpen, setCreateOpen] = useState(false)
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
	const [editOpen, setEditOpen] = useState(false)
	const selectedUser = users.find((user) => user.id === selectedUserId) ?? null
	const onManage = useCallback((id: string) => {
        setSelectedUserId(id)
        setEditOpen(true)
    }, [])

	return (
		<main className='mx-auto w-full space-y-7'>
			<DashboardPageHeader
				title='Пользователи'
				description='Управление командой, ролями и безопасностью учётных записей'
				action={
					<Button
						type='button'
						className='h-13 p-4 border cursor-pointer bg-brand-charcoal'
						onClick={() => setCreateOpen(true)}
					>
						<Plus size={20} aria-hidden='true' />
						Добавить пользователя
					</Button>
				}
			/>

			<UsersDataTable users={users} actorId={actorId} onManage={onManage} />
			<CreateUserSheet open={createOpen} onOpenChange={setCreateOpen} />
			<EditUserSheet
				user={selectedUser}
                open={editOpen}
                onOpenChange={setEditOpen}
			/>
		</main>
	)
}
