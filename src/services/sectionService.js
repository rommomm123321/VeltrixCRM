import { sectionRepository } from '../repositories/index.js'

export const getAllSectionsByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC'],
	limit = 10,
	offset = 0
) => {
	return await sectionRepository.findAllByUser(
		userId,
		filters,
		sort,
		limit,
		offset
	)
}

export const getSectionById = async id => {
	return await sectionRepository.findById(id)
}

export const createSection = async (
	sectionData,
	hallIds = [],
	trainerId = null
) => {
	return await sectionRepository.create(sectionData, hallIds, trainerId)
}

export const updateSection = async (id, data, hallIds = [], userId) => {
	return await sectionRepository.update(id, data, hallIds, userId)
}

export const deleteSection = async ids => {
	if (Array.isArray(ids)) {
		return await sectionRepository.removeMany(ids)
	} else {
		return await sectionRepository.remove(ids)
	}
}

export default {
	getAllSectionsByUser,
	getSectionById,
	createSection,
	updateSection,
	deleteSection,
}
