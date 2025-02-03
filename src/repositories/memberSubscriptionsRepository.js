import { MemberSubscriptions } from '../models/index.js'
import { responses } from '../utils/responses.js'

const findAll = async () => {
	return await MemberSubscriptions.findAll()
}

const findById = async id => {
	return await MemberSubscriptions.findByPk(id)
}

const create = async data => {
	return await MemberSubscriptions.create(data)
}

const update = async (id, memberSubscriptionData) => {
	const memberSubscription = await MemberSubscriptions.findById(id)
	if (!memberSubscription) {
		throw new Error(responses.error.memberSubscriptionsNotFound)
	}
	return await memberSubscription.update(memberSubscriptionData)
}

const remove = async id => {
	const memberSubscription = await MemberSubscriptions.findByPk(id)
	if (!memberSubscription) {
		throw new Error(responses.error.memberSubscriptionsNotFound)
	}
	return memberSubscription.destroy()
}

const totalEarningsByHall = async hallId => {
	const result = await MemberSubscriptions.sum('priceAtPurchase', {
		include: [{ model: Member, where: { hallId } }],
	})
	return result || 0
}

const totalEarningsBySection = async sectionId => {
	const result = await MemberSubscriptions.sum('priceAtPurchase', {
		where: { sectionId },
	})
	return result || 0
}

const totalEarningsBySubscription = async subscriptionId => {
	const result = await MemberSubscriptions.sum('priceAtPurchase', {
		where: { subscriptionId },
	})
	return result || 0
}

const findByMemberId = async memberId => {
	return await MemberSubscriptions.findAll({ where: { memberId } })
}

const findBySubscriptionId = async subscriptionId => {
	return await MemberSubscriptions.findAll({ where: { subscriptionId } })
}

const findByHallId = async hallId => {
	return await MemberSubscriptions.findAll({ where: { hallId } })
}

const findBySectionId = async sectionId => {
	return await MemberSubscriptions.findAll({ where: { sectionId } })
}

export default {
	findAll,
	findById,
	create,
	update,
	remove,
	totalEarningsByHall,
	totalEarningsBySection,
	totalEarningsBySubscription,
	findByMemberId,
	findBySubscriptionId,
	findByHallId,
	findBySectionId,
}
