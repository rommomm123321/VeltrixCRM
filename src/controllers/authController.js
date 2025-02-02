import { authService } from '../services/index.js'
import { responseError, responseSuccess } from '../utils/responseHelper.js'
import { responses } from '../utils/responses.js'
import {
	requestVerificationCode,
	requestVerifyCode,
} from '../validation/index.js'

export const requestCode = async (req, res) => {
	try {
		await requestVerificationCode.validateAsync(req.body)
		const { email } = req.body
		await authService.requestVerificationCode(email)
		responseSuccess(res, 200, { message: responses.success.codeSent })
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

export const verify = async (req, res) => {
	try {
		await requestVerifyCode.validateAsync(req.body)
		const { email, verificationCode: code } = req.body
		const { updatedUser, token } = await authService.verifyCode(email, code)
		responseSuccess(res, 200, { user: updatedUser, token })
	} catch (error) {
		responseError(res, 400, { error: error.message })
	}
}

export const me = async (req, res) => {
	try {
		const userId = req.user.id
		const { user, token } = await authService.me(userId)
		responseSuccess(res, 200, { user, token })
	} catch (error) {
		responseError(res, 400, { error: error.message })
	}
}

export default { requestCode, verify, me }
