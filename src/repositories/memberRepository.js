import { Op } from 'sequelize'
import {
	Hall,
	Member,
	MemberSubscriptions,
	MemberTransaction,
	Section,
	Subscription,
	Trainer,
} from '../models/index.js'
import { responses } from '../utils/responses.js'
import memberTransactionRepository from './memberTransactionRepository.js'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/db.js'

const findAllByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC'],
	limit = 10,
	offset = 0
) => {
	if (filters.subscriptionId && typeof filters.subscriptionId === 'string') {
		filters.subscriptionId = filters.subscriptionId
			.split(',')
			.map(id => parseInt(id, 10))
	}

	const cleanedFilters = Object.fromEntries(
		Object.entries(filters).filter(([key, value]) => value && value !== '')
	)

	const where = { userId }

	if (filters.firstName) {
		where.firstName = { [Op.iLike]: `%${filters.firstName}%` }
	}
	if (filters.lastName) {
		where.lastName = { [Op.iLike]: `%${filters.lastName}%` }
	}

	if (filters.email) {
		where.email = { [Op.iLike]: `%${filters.email}%` }
	}

	if (filters.phone) {
		where.phone = { [Op.iLike]: `%${filters.phone}%` }
	}

	const include = [
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
					where: filters.subscriptionId
						? { id: { [Op.in]: filters.subscriptionId } }
						: undefined,
					required: !!filters.subscriptionId,
				},
			],
		},
		{
			model: MemberTransaction,
			required: false,
			include: [
				{
					model: Subscription,
					required: false,
				},
			],
		},
		{
			model: Hall,
			required: false,
		},
	]

	return await Member.findAndCountAll({
		where,
		order: [
			sort,
			['id', 'DESC'],
			[MemberSubscriptions, 'subscriptionId', 'ASC'],
		],
		limit,
		offset,
		include,
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
		registrationDate,
	} = memberData

	if (registrationDate) {
		memberData.registrationDate = new Date(registrationDate)
	}

	const existingMember = await Member.findOne({
		where: { phone: memberData.phone },
	})
	if (existingMember) {
		throw new Error(responses.validation.memberPhoneRequired)
	}
	const existingMemberWithEmail = await Member.findOne({
		where: { email: memberData.email },
	})
	if (memberData.email && existingMemberWithEmail) {
		throw new Error(responses.validation.memberEmailRequired)
	}
	const newMember = await Member.create({
		userId,
		hallId,
		firstName,
		lastName,
		age,
		gender,
		phone,
		email,
		registrationDate,
		uuid: uuidv4(),
	})
	const expirationDate = new Date(registrationDate || new Date())
	expirationDate.setDate(expirationDate.getDate() + 30)

	const subscriptionsData = await Promise.all(
		sections.map(async ({ sectionId, subscriptionId }) => {
			const subscription = await Subscription.findByPk(subscriptionId, {
				attributes: ['price', 'numberOfSessions'],
			})
			if (!subscription)
				throw new Error(`Subscription ${subscriptionId} not found`)

			const section = await Section.findByPk(sectionId, {
				attributes: ['trainerId'],
			})
			const trainer = await Trainer.findByPk(section?.trainerId, {
				attributes: ['id'],
				paranoid: true,
			})
			const trainerId = trainer?.id ? parseInt(trainer?.id, 10) : null

			await memberTransactionRepository.addSubscriptionToMember(
				userId,
				newMember.id,
				trainerId,
				hallId,
				sectionId,
				subscriptionId,
				subscription.price,
				registrationDate
			)
			return {
				memberId: newMember.id,
				hallId,
				sectionId,
				subscriptionId,
				priceAtPurchase: subscription.price,
				totalSessions: subscription.numberOfSessions,
				purchaseDate: registrationDate || new Date(),
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

	const existingMember = await Member.findOne({
		where: { phone: memberData.phone },
	})
	if (existingMember && existingMember.id != id) {
		throw new Error(responses.validation.memberPhoneRequired)
	}
	const existingMemberWithEmail = await Member.findOne({
		where: { email: memberData.email },
	})
	if (
		memberData.email &&
		existingMemberWithEmail &&
		existingMemberWithEmail.id != id
	) {
		throw new Error(responses.validation.memberEmailRequired)
	}

	await member.update({
		hallId: memberData.hallId,
		firstName: memberData.firstName,
		lastName: memberData.lastName,
		age: memberData.age,
		gender: memberData.gender,
		phone: memberData.phone,
		email: memberData.email,
		registrationDate: new Date(memberData.registrationDate),
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

		const sectionDetails = await Section.findByPk(sectionId, {
			attributes: ['trainerId'],
		})
		const trainer = await Trainer.findByPk(sectionDetails?.trainerId, {
			attributes: ['id'],
			paranoid: true,
		})
		const trainerId = trainer?.id ? parseInt(trainer?.id, 10) : null

		if (existingSubscription) {
			if (existingSubscription.subscriptionId !== subscriptionId) {
				existingSubscription.subscriptionId = subscriptionId
				existingSubscription.priceAtPurchase = subscription.price
				existingSubscription.totalSessions = subscription.numberOfSessions
				existingSubscription.purchaseDate = new Date()
				existingSubscription.expirationDate = expirationDate
				existingSubscription.usedSessions = 0
				existingSubscription.status = 'active'
				await existingSubscription.save()

				await memberTransactionRepository.addSubscriptionToMember(
					member.userId,
					id,
					trainerId,
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
				trainerId,
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

const findMemberSubscriptionsByPhone = async uniqueId => {
	const member = await Member.findOne({
		where: { uuid: uniqueId },
		include: [
			{
				model: MemberSubscriptions,
				required: false,
				include: [
					{ model: Hall, required: false },
					{ model: Section, required: false },
					{ model: Subscription, required: false },
				],
			},
		],
	})
	if (!member) {
		throw new Error('Member not found')
	}

	const subscriptionsWithTrackUrl = member.MemberSubscriptions.map(
		subscription => ({
			...subscription.toJSON(),
			trackUrl: `/track-visit?memberId=${member.id}&sectionId=${subscription.sectionId}`,
		})
	)

	return subscriptionsWithTrackUrl
}

export default {
	findAllByUser,
	findAll,
	findById,
	create,
	update,
	remove,
	removeMany,
	findMemberSubscriptionsByPhone,
}
