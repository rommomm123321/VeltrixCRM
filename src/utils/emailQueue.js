import EmailQueue from '../models/emailQueue.js'
import { sendVerificationCode } from './email.js'

const processEmailQueue = async () => {
	while (true) {
		const job = await EmailQueue.findOne({
			where: { status: 'pending' },
			order: [['createdAt', 'ASC']],
		})

		if (!job) break

		try {
			await job.update({ status: 'processing' })

			await sendVerificationCode(job.email, job.code)

			await job.update({ status: 'completed' })
		} catch (error) {
			console.error(`Failed to process email job: ${error.message}`)
			await job.update({ status: 'failed' })
		}
	}
}

const checkAndStartQueue = async () => {
	try {
		const pendingJob = await EmailQueue.findOne({
			where: { status: 'pending' },
		})
		if (pendingJob) {
			await processEmailQueue()
			setTimeout(checkAndStartQueue, 5000)
		} else {
			setTimeout(checkAndStartQueue, 15000)
		}
	} catch (error) {
		console.error(`Error in checkAndStartQueue: ${error.message}`)
		setTimeout(checkAndStartQueue, 15000)
	}
}

checkAndStartQueue()

export const addEmailToQueue = async (email, code, type = 'verification') => {
	const existingJob = await EmailQueue.findOne({
		where: { email, type, status: 'pending' },
	})

	if (!existingJob) {
		await EmailQueue.create({ email, code, type, status: 'pending' })
	}
}
