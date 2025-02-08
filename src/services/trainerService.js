import { trainerRepository } from '../repositories/index.js'
import { responses } from '../utils/responses.js'

const getAllTrainersByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC'],
	limit = 10,
	offset = 0
) => {
	return await trainerRepository.findAllByUser(
		userId,
		filters,
		sort,
		limit,
		offset
	)
}

const createTrainer = async data => {
	return await trainerRepository.create(data)
}

const updateTrainer = async (id, data) => {
	const updatedTrainer = await trainerRepository.update(id, data)
	if (!updatedTrainer) {
		throw new Error(responses.validation.trainerNotFound)
	}
	return updatedTrainer
}

const deleteTrainer = async id => {
	await trainerRepository.remove(id)
}

export default {
	getAllTrainersByUser,
	createTrainer,
	updateTrainer,
	deleteTrainer,
}
