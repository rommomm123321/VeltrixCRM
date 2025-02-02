import { subscriptionService } from '../services/index.js'
import { responseError, responseSuccess } from '../utils/responseHelper.js'

const getAllSubscriptionsByUser = async (req, res) => {
	const { id: userId } = req.user
	const { filters = {}, sort = ['createdAt', 'ASC'] } = req.query
	try {
		const subscriptions = await subscriptionService.getAllSubscriptionsByUser(
			userId,
			filters,
			sort
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
		const newSubscription = await subscriptionService.createSubscription(
			{
				...subscriptionData,
				userId,
			},
			sectionIds
		)
		responseSuccess(res, 201, newSubscription)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const updateSubscription = async (req, res) => {
	const { id: userId } = req.user
	const { sectionIds = [], ...subscriptionData } = req.body
	try {
		const updatedSubscription = await subscriptionService.updateSubscription(
			req.params.id,
			subscriptionData,
			sectionIds,
			userId
		)
		responseSuccess(res, 200, updatedSubscription)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const deleteSubscription = async (req, res) => {
	try {
		const ids = req.body.id || req.params.id

		if (!ids) {
			return responseError(res, 400, { error: 'No IDs provided for deletion' })
		}

		await subscriptionService.deleteSubscription(ids)
		responseSuccess(res, 200, null)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const trackVisitController = async (req, res) => {
	try {
		const { memberId, sectionId } = req.body
		await subscriptionService.trackVisit(memberId, sectionId)
		res.status(200).send({ message: 'Visit tracked successfully' })
	} catch (error) {
		res.status(400).send({ error: error.message })
	}
}

const renewSubscription = async (req, res) => {
	try {
		const { memberId, sectionId, subscriptionId } = req.body
		await subscriptionService.renewSubscription(
			memberId,
			sectionId,
			subscriptionId
		)
		res.status(200).send({ message: 'Subscription renewed successfully' })
	} catch (error) {
		res.status(400).send({ error: error.message })
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
