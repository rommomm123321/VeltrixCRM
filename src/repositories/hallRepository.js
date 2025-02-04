import { Hall } from '../models/index.js'
import { responses } from '../utils/responses.js'

const findAllByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC']
) => {
	return await Hall.findAll({
		where: {
			...filters,
			userId,
		},
		order: [sort],
	})
}

const findAll = async () => {
	return await Hall.findAll()
}

const findById = async id => {
	return await Hall.findByPk(id)
}

const create = async hallData => {
	const hall = await Hall.findOne({ where: { name: hallData.name } })
	if (hall) {
		throw new Error(responses.error.hallNameUnique)
	}
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
	const hall = await findById(id)
	if (!hall) {
		throw new Error(responses.error.hallNotFound)
	}
	return await hall.destroy()
}

export default {
	findAllByUser,
	findAll,
	findById,
	create,
	update,
	remove,
}
