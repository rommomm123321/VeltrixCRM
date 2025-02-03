import sequelize from '../config/db.js'
import {
	Hall,
	Member,
	MemberSubscriptions,
	MemberTransaction,
	Section,
	Subscription,
} from '../models/index.js'
import { responses } from '../utils/responses.js'
import memberTransactionRepository from './memberTransactionRepository.js'

const findAllByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC']
) => {
	return await Member.findAll({
		where: {
			...filters,
			userId,
		},
		order: [sort],

		include: [
			{
				model: MemberSubscriptions,
				required: false,
				include: [
					{
						model: Hall,
						required: false,
					},
					{
						model: Section,
						required: false,
					},
					{
						model: Subscription,
						required: false,
					},
				],
			},
			{
				model: MemberTransaction,
				required: false,
			},
		],
	})
}

const findAll = async () => {
	return await Member.findAll()
}

const findById = async id => {
	return await Member.findByPk(id)
}

const create = async memberData => {
	const {
		hallId,
		sections,
		userId,
		firstName,
		lastName,
		age,
		gender,
		phone,
		email,
	} = memberData

	const newMember = await Member.create({
		userId,
		firstName,
		lastName,
		age,
		gender,
		phone,
		email,
	})

	const expirationDate = new Date()
	expirationDate.setDate(expirationDate.getDate() + 30)

	const subscriptionsData = await Promise.all(
		sections.map(async ({ sectionId, subscriptionId }) => {
			const subscription = await Subscription.findByPk(subscriptionId, {
				attributes: ['price', 'numberOfSessions'],
			})
			if (!subscription)
				throw new Error(`Subscription ${subscriptionId} not found`)

			await memberTransactionRepository.addSubscriptionToMember(
				userId,
				newMember.id,
				hallId,
				sectionId,
				subscriptionId,
				subscription.price
			)

			return {
				memberId: newMember.id,
				hallId,
				sectionId,
				subscriptionId,
				priceAtPurchase: subscription.price,
				totalSessions: subscription.numberOfSessions,
				expirationDate,
				status: 'active',
			}
		})
	)

	await MemberSubscriptions.bulkCreate(subscriptionsData)

	return newMember
}

const update = async (id, memberData) => {
	const member = await Member.findByPk(id)
	if (!member) {
		throw new Error('Member not found')
	}

	await member.update({
		firstName: memberData.firstName,
		lastName: memberData.lastName,
		age: memberData.age,
		gender: memberData.gender,
		phone: memberData.phone,
		email: memberData.email,
	})

	const existingSubscriptions = await MemberSubscriptions.findAll({
		where: { memberId: id },
	})
	const existingMap = new Map(
		existingSubscriptions.map(sub => [sub.sectionId, sub])
	)

	const expirationDate = new Date()
	expirationDate.setDate(expirationDate.getDate() + 30)

	for (const section of memberData.sections) {
		const { sectionId, subscriptionId } = section
		const existingSubscription = existingMap.get(sectionId)

		const subscription = await Subscription.findByPk(subscriptionId, {
			attributes: ['price', 'numberOfSessions'],
		})
		if (!subscription) {
			throw new Error(`Subscription with ID ${subscriptionId} not found`)
		}

		if (existingSubscription) {
			if (existingSubscription.subscriptionId !== subscriptionId) {
				existingSubscription.subscriptionId = subscriptionId
				existingSubscription.priceAtPurchase = subscription.price
				existingSubscription.totalSessions = subscription.numberOfSessions
				existingSubscription.expirationDate = expirationDate
				await existingSubscription.save()

				await memberTransactionRepository.addSubscriptionToMember(
					member.userId,
					id,
					memberData.hallId,
					sectionId,
					subscriptionId,
					subscription.price
				)
			}
		} else {
			await MemberSubscriptions.create({
				memberId: id,
				hallId: memberData.hallId,
				sectionId,
				subscriptionId,
				priceAtPurchase: subscription.price,
				totalSessions: subscription.numberOfSessions,
				expirationDate,
				status: 'active',
			})

			await memberTransactionRepository.addSubscriptionToMember(
				member.userId,
				id,
				memberData.hallId,
				sectionId,
				subscriptionId,
				subscription.price
			)
		}
	}

	const newSectionIds = new Set(memberData.sections.map(s => s.sectionId))
	for (const sub of existingSubscriptions) {
		if (!newSectionIds.has(sub.sectionId)) {
			await sub.destroy()
		}
	}

	return member
}

const remove = async id => {
	const subscription = await findById(id)
	if (!subscription) {
		throw new Error(responses.error.sectionNotFound)
	}
	return await subscription.destroy()
}

const removeMany = async ids => {
	const subscription = await findAll({
		where: {
			id: ids,
		},
	})

	if (subscription.length !== ids.length) {
		throw new Error(responses.error.sectionNotFound)
	}

	return await Subscription.destroy({
		where: {
			id: ids,
		},
	})
}

export default {
	findAllByUser,
	findAll,
	findById,
	create,
	update,
	remove,
	removeMany,
}
