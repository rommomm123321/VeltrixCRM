import { Hall, HallSection, Section } from '../models/index.js'
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
	const include = [
		{
			model: Hall,
			through: {
				attributes: [],
			},
			where: filters.hallId ? { id: { [Op.in]: filters.hallId } } : undefined,
			required: !!filters.hallId,
		},
	]
	return await Section.findAndCountAll({
		where,
		order: [sort, ['id', 'DESC']],
		limit,
		offset,
		include,
	})
}

const findAll = async () => {
	return await Section.findAll()
}

const findById = async id => {
	return await Section.findByPk(id)
}

const create = async (sectionData, hallIds = []) => {
	const halls = await hallRepository.findAllByUser(sectionData?.userId, {
		id: hallIds,
	})

	if (halls.count !== hallIds.length) {
		throw new Error(responses.error.sectionNotBelongHall)
	}
	const newSection = await Section.create(sectionData)
	if (hallIds.length > 0) {
		const hallIdsToAttach = halls.rows.map(hall => hall.id)
		await newSection.addHalls(hallIdsToAttach)
	}

	return newSection
}

const update = async (id, sectionData, hallIds = [], userId) => {
	const halls = await hallRepository.findAllByUser(userId, {
		id: hallIds,
	})
	if (halls.count !== hallIds.length) {
		throw new Error(responses.error.sectionNotBelongHall)
	}
	const section = await findById(id)
	if (!section) {
		throw new Error(responses.error.sectionNotFound)
	}
	if (hallIds.length > 0) {
		const hallIdsToAttach = halls.rows.map(hall => hall.id)
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
