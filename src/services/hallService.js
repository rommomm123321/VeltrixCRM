import { hallRepository } from '../repositories/index.js'
import { responses } from '../utils/responses.js'

const getAllHallsByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC'],
	limit = 10,
	offset = 0
) => {
	return await hallRepository.findAllByUser(
		userId,
		filters,
		sort,
		limit,
		offset
	)
}

const getHallById = async id => {
	const hall = await hallRepository.findById(id)
	if (!hall) {
		throw new Error(responses.error.hallNotFound)
	}
	return hall
}

const createHall = async hallData => {
	return await hallRepository.create(hallData)
}

const updateHall = async (id, hallData) => {
	const updatedHall = await hallRepository.update(id, hallData)
	if (!updatedHall) {
		throw new Error(responses.error.hallNotFound)
	}
	return updatedHall
}

const deleteHall = async id => {
	await hallRepository.remove(id)
}

export default {
	getAllHallsByUser,
	getHallById,
	createHall,
	updateHall,
	deleteHall,
}
