import { memberService } from '../services/index.js'
import { responseSuccess, responseError } from '../utils/responseHelper.js'
import { responses } from '../utils/responses.js'
import { requestMember } from '../validation/index.js'

const getAllMembersByUser = async (req, res) => {
	const { id: userId } = req.user
	const {
		filters = {},
		sort = ['createdAt', 'ASC'],
		limit = 10,
		offset = 0,
		...rest
	} = req.query
	try {
		const members = await memberService.getAllMembersByUser(
			userId,
			{ ...filters, ...rest },
			sort,
			limit,
			offset
		)
		responseSuccess(res, 200, members)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const getMemberById = async (req, res) => {
	try {
		const member = await memberService.getMemberById(req.params.id)
		responseSuccess(res, 200, member)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const createMember = async (req, res) => {
	try {
		await requestMember.validateAsync(req.body)
		const newMember = await memberService.createMember({
			...req.body,
			userId: req.user.id,
		})
		responseSuccess(res, 201, newMember)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const updateMember = async (req, res) => {
	try {
		await requestMember.validateAsync(req.body)
		const updatedMember = await memberService.updateMember(
			req.params.id,
			req.body
		)
		responseSuccess(res, 200, updatedMember)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const deleteMember = async (req, res) => {
	try {
		const ids = req.body.id || req.params.id

		if (!ids) {
			return responseError(res, 400, {
				error: responses.error.noIdsProvidedForDeletion,
			})
		}

		await memberService.deleteMember(ids)
		responseSuccess(res, 200, null)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const getAllMemberSubscriptionsByPhone = async (req, res) => {
	try {
		const { uniqueId } = req.query
		if (!uniqueId) {
			return responseError(res, 400, {
				error: responses.error.uniqueIdIsRequired,
			})
		}
		const subscriptions = await memberService.getAllMemberSubscriptionsByPhone(
			uniqueId
		)
		responseSuccess(res, 200, subscriptions)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

export default {
	getAllMembersByUser,
	createMember,
	getMemberById,
	updateMember,
	deleteMember,
	getAllMemberSubscriptionsByPhone,
}
