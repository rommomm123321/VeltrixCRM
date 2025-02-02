import { subscriptionRepository } from '../repositories/index.js'

export const getAllSubscriptionsByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC']
) => {
	return await subscriptionRepository.findAllByUser(userId, filters, sort)
}

export const getSubscriptionById = async id => {
	return await subscriptionRepository.findById(id)
}

export const createSubscription = async (subscriptionData, sectionIds = []) => {
	return await subscriptionRepository.create(subscriptionData, sectionIds)
}

export const updateSubscription = async (id, data, sectionIds = [], userId) => {
	return await subscriptionRepository.update(id, data, sectionIds, userId)
}

export const deleteSubscription = async ids => {
	if (Array.isArray(ids)) {
		return await subscriptionRepository.removeMany(ids)
	} else {
		return await subscriptionRepository.remove(ids)
	}
}

export const trackVisit = async (memberId, sectionId) => {
	return await subscriptionRepository.trackVisit(memberId, sectionId)
}
export const renewSubscription = async (
	memberId,
	sectionId,
	subscriptionId
) => {
	await subscriptionRepository.renewSubscription(
		memberId,
		sectionId,
		subscriptionId
	)
}

export default {
	getAllSubscriptionsByUser,
	getSubscriptionById,
	createSubscription,
	updateSubscription,
	deleteSubscription,
	trackVisit,
	renewSubscription,
}
