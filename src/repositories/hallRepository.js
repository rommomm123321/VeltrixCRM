import { Op } from 'sequelize'
import {
	Hall,
	Member,
	MemberSubscriptions,
	MemberTransaction,
	Subscription,
} from '../models/index.js'
import { responses } from '../utils/responses.js'

const findAllByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC'],
	limit = 10,
	offset = 0
) => {
	const cleanedFilters = Object.fromEntries(
		Object.entries(filters).filter(([key, value]) => value && value !== '')
	)

	const where = { ...cleanedFilters, userId }
	if (filters.name) {
		where.name = { [Op.iLike]: `%${filters.name}%` }
	}
	return await Hall.findAndCountAll({
		where,
		order: [sort, ['id', 'DESC']],
		limit,
		offset,
	})
}

const findAll = async where => {
	return await Hall.findAll(where)
}

const findById = async id => {
	return await Hall.findByPk(id)
}

const create = async hallData => {
	// const hall = await Hall.findOne({ where: { name: hallData.name } })
	// if (hall) {
	// 	throw new Error(responses.error.hallNameUnique)
	// }
	return await Hall.create(hallData)
}

const update = async (id, hallData) => {
	const hall = await findById(id)
	if (!hall) {
		throw new Error(responses.error.hallNotFound)
	}
	return await hall.update(hallData)
}

const remove = async id => {
	const hall = await Hall.findByPk(id)

	if (!hall) {
		throw new Error(responses.error.hallNotFound)
	}

	const activeSubscriptionsCount = await Subscription.count({
		include: [
			{
				model: MemberSubscriptions,
				where: { hallId: id },
				required: true,
			},
		],
		where: { deletedAt: null },
		paranoid: true,
	})
	const activeMembersCount = await Member.count({
		include: [
			{
				model: MemberSubscriptions,
				where: { hallId: id },
				required: true,
			},
		],
		where: { deletedAt: null },
		paranoid: true,
	})

	if (activeSubscriptionsCount > 0 || activeMembersCount > 0) {
		throw new Error(
			`${responses.error.hallCannotBeDeletedHall} ${
				activeSubscriptionsCount > 0 ? 'абонементах' : ''
			} ${activeMembersCount > 0 ? 'та відвідувачах' : ''}`
		)
	}

	await hall.destroy()
}

export default {
	findAllByUser,
	findAll,
	findById,
	create,
	update,
	remove,
}
