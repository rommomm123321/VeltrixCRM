import { sectionRepository } from '../repositories/index.js'

export const getAllSectionsByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC']
) => {
	return await sectionRepository.findAllByUser(userId, filters, sort)
}

export const getSectionById = async id => {
	return await sectionRepository.findById(id)
}

export const createSection = async (sectionData, hallIds = []) => {
	return await sectionRepository.create(sectionData, hallIds)
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
