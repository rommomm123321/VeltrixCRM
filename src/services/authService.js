import { v4 as uuidv4 } from 'uuid'
import { generateToken } from '../utils/jwt.js'
import { userRepository } from '../repositories/index.js'
import emailQueue from '../utils/queue.js'
import { responses } from '../utils/responses.js'
import { addEmailToQueue } from '../utils/emailQueue.js'

const generateVerificationCode = () => {
	return uuidv4().replace(/-/g, '').substring(0, 8)
}

const requestVerificationCode = async email => {
	const verificationCode = generateVerificationCode()
	const verificationCodeExpires = new Date(Date.now() + 5 * 60 * 1000)
	const { user, created } = await userRepository.findOrCreateUser(email, {
		verificationCode,
		verificationCodeExpires,
	})
	if (!created) {
		await userRepository.updateUser(user?.id, {
			verificationCode,
			verificationCodeExpires,
		})
	}

	// await emailQueue.add({
	// 	type: 'verification',
	// 	email,
	// 	code: verificationCode,
	// })

	await addEmailToQueue(email, verificationCode)
}

const verifyCode = async (email, code) => {
	const user = await userRepository.findUserByEmail(email)

	if (
		!user ||
		user.verificationCode !== code ||
		user.verificationCodeExpires < new Date()
	) {
		throw new Error(responses.error.invalidExpiredCode)
	}

	const updatedUser = await userRepository.updateUser(user?.id, {
		verificationCode: null,
		verificationCodeExpires: null,
	})

	const token = generateToken({ id: user.id, email: user.email })

	return { updatedUser, token }
}

const me = async userId => {
	const user = await userRepository.findById(userId)
	if (!user) {
		throw new Error(responses.error.userNotFound)
	}
	const token = generateToken({ id: user.id, email: user.email })

	return { user, token }
}

export default {
	requestVerificationCode,
	verifyCode,
	me,
}
