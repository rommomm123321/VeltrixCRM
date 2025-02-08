import { Op } from 'sequelize'
import { Trainer } from '../models/index.js'
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

	if (filters.firstName) {
		where.firstName = { [Op.iLike]: `%${filters.firstName}%` }
	}
	if (filters.lastName) {
		where.lastName = { [Op.iLike]: `%${filters.lastName}%` }
	}
	if (filters.phone) {
		where.phone = { [Op.iLike]: `%${filters.phone}%` }
	}
	if (filters.dateOfBirth) {
		if (filters.dateOfBirth.startDate && filters.dateOfBirth.endDate) {
			where.dateOfBirth = {
				[Op.between]: [
					new Date(filters.dateOfBirth.startDate),
					new Date(filters.dateOfBirth.endDate),
				],
			}
		} else if (filters.dateOfBirth.startDate) {
			where.dateOfBirth = {
				[Op.gte]: new Date(filters.dateOfBirth.startDate),
			}
		} else if (filters.dateOfBirth.endDate) {
			where.dateOfBirth = {
				[Op.lte]: new Date(filters.dateOfBirth.endDate),
			}
		}
	}

	return await Trainer.findAndCountAll({
		where,
		order: [sort, ['id', 'DESC']],
		limit,
		offset,
	})
}

const findAll = async () => {
	return await Trainer.findAll()
}

const findById = async id => {
	return await Trainer.findByPk(id)
}

const create = async data => {
	const trainer = await Trainer.findOne({ where: { phone: data.phone } })
	if (trainer) {
		throw new Error(responses.validation.trainerPhoneUnique)
	}
	return await Trainer.create(data)
}

const update = async (id, data) => {
	const trainer = await findById(id)
	if (!trainer) {
		throw new Error(responses.validation.trainerNotFound)
	}
	return await trainer.update(data)
}

const remove = async id => {
	const trainer = await findById(id)
	if (!trainer) {
		throw new Error(responses.validation.trainerNotFound)
	}
	return await trainer.destroy()
}

export default {
	findAllByUser,
	findAll,
	findById,
	create,
	update,
	remove,
}
