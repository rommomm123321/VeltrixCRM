import {
	Hall,
	Member,
	MemberSubscriptions,
	Section,
	Subscription,
} from '../models/index.js'
import { responses } from '../utils/responses.js'

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
	const { hallId, sections, userId, firstName, lastName, age, gender } =
		memberData

	const newMember = await Member.create({
		userId,
		firstName,
		lastName,
		age,
		gender,
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
	})

	if (memberData.sections && memberData.sections.length === 0) {
		await MemberSubscriptions.destroy({
			where: { memberId: id },
		})
	} else {
		await MemberSubscriptions.destroy({
			where: { memberId: id },
		})

		for (const section of memberData.sections) {
			const subscription = await Subscription.findByPk(section.subscriptionId, {
				attributes: ['price', 'numberOfSessions'],
			})
			if (!subscription) {
				throw new Error(
					`Subscription with ID ${section.subscriptionId} not found`
				)
			}

			const existingSubscription = await MemberSubscriptions.findOne({
				where: {
					memberId: id,
					sectionId: section.sectionId,
					subscriptionId: section.subscriptionId,
				},
			})

			if (!existingSubscription) {
				const expirationDate = new Date()
				expirationDate.setDate(expirationDate.getDate() + 30)

				await MemberSubscriptions.create({
					memberId: id,
					hallId: memberData.hallId,
					sectionId: section.sectionId,
					subscriptionId: section.subscriptionId,
					priceAtPurchase: subscription.price,
					totalSessions: subscription.numberOfSessions,
					expirationDate,
					status: 'active',
				})
			}
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
