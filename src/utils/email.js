import nodemailer from 'nodemailer'
import { verificationEmailTemplate } from './emailTemplates.js'

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
})

const sendMail = async ({ to, subject, html }) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to,
		subject,
		html,
	}

	try {
		await transporter.sendMail(mailOptions)
		console.log(`Email sent to ${to}`)
	} catch (error) {
		console.error('Error sending email:', error)
		throw new Error('Failed to send email')
	}
}

export const sendVerificationCode = async (email, code) => {
	await sendMail({
		to: email,
		subject: 'Ваш код підтвердження',
		html: verificationEmailTemplate(code),
	})
}
