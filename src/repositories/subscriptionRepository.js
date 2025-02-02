import { Op } from 'sequelize'
import {
	Subscription,
	SectionSubscription,
	MemberSubscriptions,
} from '../models/index.js'
import { responses } from '../utils/responses.js'
import { sectionRepository } from './index.js'

const findAllByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC']
) => {
	return await Subscription.findAll({
		where: {
			...filters,
			userId,
		},
		order: [sort],
	})
}

const findAll = async () => {
	return await Subscription.findAll()
}

const findById = async id => {
	return await Subscription.findByPk(id)
}

const create = async (subscriptionData, sectionIds = []) => {
	const sections = await sectionRepository.findAllByUser(
		subscriptionData?.userId,
		{
			id: sectionIds,
		}
	)
	if (sections.length !== sectionIds.length) {
		throw new Error(responses.error.subscriptionNotFound)
	}
	const newSubscription = await Subscription.create(subscriptionData)
	if (sectionIds.length > 0) {
		const sectionIdsToAttach = sections.map(section => section.id)
		await newSubscription.addSections(sectionIdsToAttach)
	}

	return newSubscription
}

const update = async (id, subscriptionData, sectionIds = [], userId) => {
	const sections = await sectionRepository.findAllByUser(userId, {
		id: sectionIds,
	})

	if (sections.length !== sectionIds.length) {
		throw new Error(responses.error.subscriptionNotFound)
	}
	const subscription = await findById(id)
	if (!subscription) {
		throw new Error(responses.error.subscriptionNotFound)
	}
	if (sectionIds.length > 0) {
		const sectionIdsToAttach = sections.map(section => section.id)
		await subscription.setSections(sectionIdsToAttach)
	} else {
		await subscription.setSections([])
	}
	return await subscription.update(subscriptionData)
}

const remove = async id => {
	const subscription = await findById(id)
	if (!subscription) {
		throw new Error(responses.error.subscriptionNotFound)
	}
	return await subscription.destroy()
}

const removeMany = async ids => {
	const subscriptions = await Subscription.findAll({
		where: {
			id: ids,
		},
	})

	if (subscriptions.length !== ids.length) {
		throw new Error(responses.error.subscriptionNotFound)
	}

	return await Subscription.destroy({
		where: {
			id: ids,
		},
	})
}

const trackVisit = async (memberId, sectionId) => {
	const subscriptions = await MemberSubscriptions.findAll({
		where: {
			memberId: memberId,
			sectionId: sectionId,
			status: 'active',
			expirationDate: { [Op.gte]: new Date() },
		},
	})

	if (subscriptions.length === 0) {
		throw new Error('No active subscriptions for this member and section')
	}

	for (const subscription of subscriptions) {
		if (subscription.usedSessions < subscription.totalSessions) {
			subscription.usedSessions += 1
			subscription.lastVisitDate = new Date()

			if (subscription.usedSessions >= subscription.totalSessions) {
				subscription.status = 'inactive'
			}

			await subscription.save()
		} else {
			throw new Error('This subscription has no remaining sessions')
		}
	}
}

const renewSubscription = async (memberId, sectionId, subscriptionId) => {
	const currentSubscription = await MemberSubscriptions.findOne({
		where: {
			memberId: memberId,
			sectionId: sectionId,
			// status: 'active',
		},
	})
	if (currentSubscription) {
		const subscription = await Subscription.findByPk(subscriptionId, {
			attributes: ['price', 'numberOfSessions'],
		})
		if (!subscription) {
			throw new Error(`Subscription ${subscriptionId} not found`)
		}

		const newExpirationDate = new Date()
		newExpirationDate.setDate(newExpirationDate.getDate() + 30)

		const priceAtPurchase = parseFloat(currentSubscription.priceAtPurchase) || 0
		const price = parseFloat(subscription.price) || 0

		currentSubscription.subscriptionId = subscriptionId
		currentSubscription.priceAtPurchase = priceAtPurchase + price
		currentSubscription.expirationDate = newExpirationDate
		currentSubscription.usedSessions = 0
		currentSubscription.status = 'active'

		await currentSubscription.save()
	} else {
		const subscription = await Subscription.findByPk(subscriptionId, {
			attributes: ['price'],
		})
		if (!subscription) {
			throw new Error(`Subscription ${subscriptionId} not found`)
		}

		const newExpirationDate = new Date()
		newExpirationDate.setDate(newExpirationDate.getDate() + 30)

		await MemberSubscriptions.create({
			memberId,
			sectionId,
			subscriptionId,
			priceAtPurchase: subscription.price,
			expirationDate: newExpirationDate,
			usedSessions: 0,
			status: 'active',
		})
	}
}

export default {
	findAllByUser,
	findAll,
	findById,
	create,
	update,
	remove,
	removeMany,
	trackVisit,
	renewSubscription,
}
