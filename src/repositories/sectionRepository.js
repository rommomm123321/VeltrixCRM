import {
	Hall,
	HallSection,
	Member,
	MemberSubscriptions,
	Section,
	Subscription,
	Trainer,
} from '../models/index.js'
import { hallRepository } from './index.js'
import { responses } from '../utils/responses.js'
import { Op } from 'sequelize'

const findAllByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC'],
	limit = 10,
	offset = 0
) => {
	if (filters.hallId && typeof filters.hallId === 'string') {
		filters.hallId = filters.hallId.split(',').map(id => parseInt(id, 10))
	}
	const cleanedFilters = Object.fromEntries(
		Object.entries(filters).filter(([key, value]) => value && value !== '')
	)

	const where = { userId }
	if (filters.name) {
		where.name = { [Op.iLike]: `%${filters.name}%` }
	}
	if (filters.id) {
		where.id = filters.id
	}
	if (filters.trainerId) {
		where.trainerId = filters.trainerId
	}
	const include = [
		{
			model: Hall,
			through: {
				attributes: [],
			},
			where: filters.hallId ? { id: { [Op.in]: filters.hallId } } : undefined,
			required: !!filters.hallId,
		},
		{
			model: Trainer,
			required: !!filters.trainerId,
		},
	]
	const result = await Section.findAndCountAll({
		where,
		order: [sort, ['id', 'DESC']],
		limit,
		offset,
		include,
		distinct: true,
	})

	return {
		rows: result.rows,
		count: result.count,
	}
}

const findAll = async where => {
	return await Section.findAll(where)
}

const findById = async id => {
	return await Section.findByPk(id)
}

const create = async (sectionData, hallIds = [], trainerId = null) => {
	if (trainerId) {
		const trainer = await Trainer.findByPk(trainerId)
		if (!trainer) {
			throw new Error(responses.validation.trainerNotFound)
		}
		sectionData.trainerId = trainer.id
	}

	const halls = await hallRepository.findAll({
		where: {
			userId: sectionData?.userId,
			id: hallIds,
		},
	})

	if (halls.length !== hallIds.length) {
		throw new Error(responses.error.sectionNotBelongHall)
	}
	const newSection = await Section.create(sectionData)
	if (hallIds.length > 0) {
		const hallIdsToAttach = halls.map(hall => hall.id)
		await newSection.addHalls(hallIdsToAttach)
	}

	return newSection
}

const update = async (id, sectionData, hallIds = [], userId) => {
	const halls = await hallRepository.findAll({
		where: {
			userId,
			id: hallIds,
		},
	})
	if (halls.length !== hallIds.length) {
		throw new Error(responses.error.sectionNotBelongHall)
	}
	const section = await findById(id)
	if (!section) {
		throw new Error(responses.error.sectionNotFound)
	}
	if (hallIds.length > 0) {
		const hallIdsToAttach = halls.map(hall => hall.id)
		await section.setHalls(hallIdsToAttach)
	} else {
		await section.setHalls([])
	}
	return await section.update(sectionData)
}

const remove = async id => {
	const section = await findById(id)
	if (!section) {
		throw new Error(responses.error.sectionNotFound)
	}

	const activeSubscriptionsCount = await Subscription.count({
		include: [
			{
				model: MemberSubscriptions,
				where: { sectionId: id },
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
				where: { sectionId: id },
				required: true,
			},
		],
		where: { deletedAt: null },
		paranoid: true,
	})

	if (activeSubscriptionsCount > 0 || activeMembersCount > 0) {
		throw new Error(
			`${responses.error.hallCannotBeDeletedSection} ${
				activeSubscriptionsCount > 0 ? 'абонементах' : ''
			} ${activeMembersCount > 0 ? 'та відвідувачах' : ''}`
		)
	}

	return await section.destroy()
}

const removeMany = async ids => {
	const sections = await Section.findAll({
		where: {
			id: ids,
		},
	})

	if (sections.length !== ids.length) {
		throw new Error(responses.error.sectionNotFound)
	}
	const activeSubscriptionsCount = await Subscription.count({
		include: [
			{
				model: MemberSubscriptions,
				where: { sectionId: ids },
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
				where: { sectionId: ids },
				required: true,
			},
		],
		where: { deletedAt: null },
		paranoid: true,
	})

	if (activeSubscriptionsCount > 0 || activeMembersCount > 0) {
		throw new Error(
			`${responses.error.hallCannotBeDeletedSection} ${
				activeSubscriptionsCount > 0 ? 'абонементах' : ''
			} ${activeMembersCount > 0 ? 'та відвідувачах' : ''}`
		)
	}

	return await Section.destroy({
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
