'use client'

import type { ComponentProps } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@/components/ui/field'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const controlClass =
	'rounded-sm border-dashboard-input-border bg-dashboard-input text-brand-milk aria-invalid:border-destructive aria-invalid:ring-destructive/20'

type Common = {
	id: string
	label: string
	error?: string
	description?: string
	className?: string
}

type TextProps = Common &
	Omit<ComponentProps<typeof Input>, 'id' | 'aria-invalid' | 'aria-describedby'>
export function DashboardInputField({
	id,
	label,
	error,
	description,
	className,
	...props
}: TextProps) {
	return (
		<Field data-invalid={error ? true : undefined} className='gap-2'>
			<FieldLabel htmlFor={id} className='text-brand-milk'>
				{label}
			</FieldLabel>
			<Input
				id={id}
				aria-invalid={Boolean(error)}
				aria-describedby={
					error ? `${id}-error` : description ? `${id}-description` : undefined
				}
				className={cn(controlClass, className)}
				{...props}
			/>
			{error ? (
				<FieldError id={`${id}-error`}>{error}</FieldError>
			) : description ? (
				<FieldDescription id={`${id}-description`}>
					{description}
				</FieldDescription>
			) : null}
		</Field>
	)
}

type TextareaProps = Common &
	Omit<
		ComponentProps<typeof Textarea>,
		'id' | 'aria-invalid' | 'aria-describedby'
	>
export function DashboardTextareaField({
	id,
	label,
	error,
	description,
	className,
	...props
}: TextareaProps) {
	return (
		<Field data-invalid={error ? true : undefined} className='gap-2'>
			<FieldLabel htmlFor={id} className='text-brand-milk'>
				{label}
			</FieldLabel>
			<Textarea
				id={id}
				aria-invalid={Boolean(error)}
				aria-describedby={
					error ? `${id}-error` : description ? `${id}-description` : undefined
				}
				className={cn(controlClass, className)}
				{...props}
			/>
			{error ? (
				<FieldError id={`${id}-error`}>{error}</FieldError>
			) : description ? (
				<FieldDescription id={`${id}-description`}>
					{description}
				</FieldDescription>
			) : null}
		</Field>
	)
}

type SelectProps = Common & {
	value: string
	onValueChange: (value: string) => void
	options: readonly { value: string; label: string }[]
	disabled?: boolean
}
export function DashboardSelectField({
	id,
	label,
	error,
	description,
	className,
	value,
	onValueChange,
	options,
	disabled,
}: SelectProps) {
	return (
		<Field data-invalid={error ? true : undefined} className='gap-2'>
			<FieldLabel htmlFor={id} className='text-brand-milk'>
				{label}
			</FieldLabel>
			<Select
				items={options}
				value={value}
				onValueChange={(next) => {
					if (next != null) onValueChange(next)
				}}
				disabled={disabled}
			>
				<SelectTrigger
					id={id}
					aria-invalid={Boolean(error)}
					aria-describedby={
						error
							? `${id}-error`
							: description
								? `${id}-description`
								: undefined
					}
					className={cn('h-10 w-full rounded-lg', controlClass, className)}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error ? (
				<FieldError id={`${id}-error`}>{error}</FieldError>
			) : description ? (
				<FieldDescription id={`${id}-description`}>
					{description}
				</FieldDescription>
			) : null}
		</Field>
	)
}

type CheckboxProps = Common & {
	checked: boolean
	onCheckedChange: (next: boolean) => void
	disabled?: boolean
}
export function DashboardCheckboxField({
	id,
	label,
	error,
	description,
	checked,
	onCheckedChange,
	disabled,
}: CheckboxProps) {
	return (
		<Field
			data-invalid={error ? true : undefined}
			orientation='horizontal'
			className='rounded-lg border border-dashboard-input-border bg-dashboard-input p-3'
		>
			<Checkbox
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
				aria-invalid={Boolean(error)}
			/>
			<div className='grid gap-1.5'>
				<FieldLabel htmlFor={id} className='text-brand-milk'>
					{label}
				</FieldLabel>
				{description && <FieldDescription>{description}</FieldDescription>}
				{error && <FieldError>{error}</FieldError>}
			</div>
		</Field>
	)
}
