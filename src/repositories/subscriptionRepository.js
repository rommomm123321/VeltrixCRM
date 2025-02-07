import { Op } from 'sequelize'
import {
	Subscription,
	SectionSubscription,
	MemberSubscriptions,
	Section,
} from '../models/index.js'
import { responses } from '../utils/responses.js'
import { memberTransactionRepository, sectionRepository } from './index.js'

const findAllByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC'],
	limit = 10,
	offset = 0
) => {
	if (filters.sectionId && typeof filters.sectionId === 'string') {
		filters.sectionId = filters.sectionId.split(',').map(id => parseInt(id, 10))
	}
	const cleanedFilters = Object.fromEntries(
		Object.entries(filters).filter(([key, value]) => value && value !== '')
	)

	const where = { userId }

	if (filters.name) {
		where.name = { [Op.iLike]: `%${filters.name}%` }
	}

	const include = [
		{
			model: Section,
			through: {
				attributes: [],
			},
			where: filters.sectionId
				? { id: { [Op.in]: filters.sectionId } }
				: undefined,
			required: !!filters.sectionId,
		},
	]
	return await Subscription.findAndCountAll({
		where,
		order: [sort, ['id', 'DESC']],
		limit,
		offset,
		include,
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
	if (sections.count !== sectionIds.length) {
		throw new Error(responses.error.subscriptionNotFound)
	}
	const newSubscription = await Subscription.create(subscriptionData)
	if (sectionIds.length > 0) {
		const sectionIdsToAttach = sections.rows.map(section => section.id)
		await newSubscription.addSections(sectionIdsToAttach)
	}

	return newSubscription
}

const update = async (id, subscriptionData, sectionIds = [], userId) => {
	const sections = await sectionRepository.findAllByUser(userId, {
		id: sectionIds,
	})
	if (sections.rows.length !== sectionIds.length) {
		throw new Error(responses.error.subscriptionNotFound)
	}
	const subscription = await findById(id)
	if (!subscription) {
		throw new Error(responses.error.subscriptionNotFound)
	}
	if (sectionIds.length > 0) {
		const sectionIdsToAttach = sections.rows.map(section => section.id)
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

const renewSubscription = async (
	memberId,
	sectionId,
	subscriptionId,
	userId
) => {
	const currentSubscription = await MemberSubscriptions.findOne({
		where: {
			memberId: memberId,
			sectionId: sectionId,
		},
	})
	if (currentSubscription.status == 'active') {
		throw new Error(`Subscription status is active`)
	}
	if (currentSubscription) {
		const subscription = await Subscription.findByPk(subscriptionId, {
			attributes: ['price', 'numberOfSessions'],
		})
		if (!subscription) {
			throw new Error(`Subscription ${subscriptionId} not found`)
		}

		const newExpirationDate = new Date()
		newExpirationDate.setDate(newExpirationDate.getDate() + 30)

		currentSubscription.subscriptionId = subscriptionId
		currentSubscription.purchaseDate = new Date()
		currentSubscription.expirationDate = newExpirationDate
		currentSubscription.usedSessions = 0
		currentSubscription.status = 'active'
		await currentSubscription.save()
		await memberTransactionRepository.addSubscriptionToMember(
			userId,
			memberId,
			currentSubscription.hallId,
			sectionId,
			subscriptionId,
			subscription.price
		)
	} else {
		const subscription = await Subscription.findByPk(subscriptionId, {
			attributes: ['price'],
		})
		if (!subscription) {
			throw new Error(`Subscription ${subscriptionId} not found`)
		}

		const newExpirationDate = new Date()
		newExpirationDate.setDate(newExpirationDate.getDate() + 30)

		const newMemberSubscriptions = await MemberSubscriptions.create({
			memberId,
			sectionId,
			subscriptionId,
			priceAtPurchase: subscription.price,
			purchaseDate: new Date(),
			expirationDate: newExpirationDate,
			usedSessions: 0,
			status: 'active',
		})
		await memberTransactionRepository.addSubscriptionToMember(
			userId,
			memberId,
			newMemberSubscriptions.hallId,
			sectionId,
			subscriptionId,
			subscription.price
		)
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
