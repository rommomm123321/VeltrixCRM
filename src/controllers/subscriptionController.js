import { subscriptionService } from '../services/index.js'
import { responseError, responseSuccess } from '../utils/responseHelper.js'
import { responses } from '../utils/responses.js'
import {
	requestCreateSubscription,
	requestUpdateSubscription,
	requestTrackVisit,
	requestRenewSubscription,
} from '../validation/index.js'

const getAllSubscriptionsByUser = async (req, res) => {
	const { id: userId } = req.user
	const {
		filters = {},
		sort = ['createdAt', 'ASC'],
		limit = 10,
		offset = 0,
		...rest
	} = req.query
	try {
		const subscriptions = await subscriptionService.getAllSubscriptionsByUser(
			userId,
			{ ...filters, ...rest },
			sort,
			limit,
			offset
		)
		responseSuccess(res, 200, subscriptions)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const getSubscriptionById = async (req, res) => {
	try {
		const subscription = await subscriptionService.getSubscriptionById(
			req.params.id
		)
		responseSuccess(res, 200, subscription)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const createSubscription = async (req, res) => {
	const { id: userId } = req.user
	const { sectionIds = [], ...subscriptionData } = req.body
	try {
		await requestCreateSubscription.validateAsync(req.body)
		const newSubscription = await subscriptionService.createSubscription(
			{
				...subscriptionData,
				userId,
			},
			sectionIds
		)
		responseSuccess(res, 201, newSubscription)
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			responseError(res, 400, { error: responses.error.subscriptionNameUnique })
		} else if (error.isJoi) {
			responseError(res, 400, { error: error.details[0].message })
		} else {
			responseError(res, 500, { error: error.message })
		}
	}
}

const updateSubscription = async (req, res) => {
	const { id: userId } = req.user
	const { sectionIds = [], ...subscriptionData } = req.body
	try {
		await requestUpdateSubscription.validateAsync(req.body)
		const updatedSubscription = await subscriptionService.updateSubscription(
			req.params.id,
			subscriptionData,
			sectionIds,
			userId
		)
		responseSuccess(res, 200, updatedSubscription)
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			responseError(res, 400, { error: responses.error.subscriptionNameUnique })
		} else if (error.isJoi) {
			responseError(res, 400, { error: error.details[0].message })
		} else {
			responseError(res, 500, { error: error.message })
		}
	}
}

const deleteSubscription = async (req, res) => {
	try {
		const ids = req.body.id || req.params.id

		if (!ids) {
			return responseError(res, 400, {
				error: responses.error.noIdsProvidedForDeletion,
			})
		}

		await subscriptionService.deleteSubscription(ids)
		responseSuccess(res, 200, null)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const trackVisitController = async (req, res) => {
	try {
		await requestTrackVisit.validateAsync({ ...req.body, ...req.query })
		const memberId = req.body.memberId || req.query.memberId
		const sectionId = req.body.sectionId || req.query.sectionId
		const userId = req.user.id
		if (!memberId || !sectionId) {
			throw new Error('memberId and sectionId are required')
		}
		await subscriptionService.trackVisit(memberId, sectionId, userId)
		responseSuccess(res, 200, { message: responses.success.visitTracked })
	} catch (error) {
		responseError(res, 400, { error: error.message })
	}
}

const renewSubscription = async (req, res) => {
	try {
		await requestRenewSubscription.validateAsync(req.body)
		const { id: userId } = req.user
		const { memberId, sectionId, subscriptionId } = req.body
		await subscriptionService.renewSubscription(
			memberId,
			sectionId,
			subscriptionId,
			userId
		)
		responseSuccess(res, 200, {
			message: responses.success.subscriptionRenewed,
		})
	} catch (error) {
		responseError(res, 400, { error: error.message })
	}
}

export default {
	getAllSubscriptionsByUser,
	getSubscriptionById,
	createSubscription,
	updateSubscription,
	deleteSubscription,
	trackVisitController,
	renewSubscription,
}
