import nodemailer from 'nodemailer'

import { env } from '@/env'

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: env.SMTP_SECURE,

	auth:
		env.SMTP_USER && env.SMTP_PASSWORD
			? {
					user: env.SMTP_USER,
					pass: env.SMTP_PASSWORD,
				}
			: undefined,
})

type SendSecurityCodeParams = {
	to: string
	code: string
}

export async function sendSecurityCode({ to, code }: SendSecurityCodeParams) {
	await transporter.sendMail({
		from: env.SMTP_FROM,
		to,
		subject: 'STUDIO POLE — код подтверждения входа',
		text: [
			'Код подтверждения входа в STUDIO POLE:',
			'',
			code,
			'',
			'Если вы не пытались войти, проигнорируйте это письмо.',
		].join('\n'),
	})
}
