import Queue from 'bull'
import { sendVerificationCode } from './email.js'
const emailQueue = new Queue('emailQueue', {
	redis: {
		host: process.env.REDIS_HOST || '127.0.0.1',
		port: process.env.REDIS_PORT || 6379,
	},
})

emailQueue.process(async job => {
	const { type, email, code } = job.data

	try {
		if (type === 'verification') {
			await sendVerificationCode(email, code)
		}
	} catch (error) {
		console.error(`Failed to process email job: ${error.message}`)
		throw error
	}
})

export default emailQueue
