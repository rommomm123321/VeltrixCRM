import { Section } from '../models/index.js'
import { hallRepository } from './index.js'
import { responses } from '../utils/responses.js'

const findAllByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC']
) => {
	return await Section.findAll({
		where: {
			...filters,
			userId,
		},
		order: [sort],
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
	const halls = await hallRepository.findAllByUser(userId, {
		id: hallIds,
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
