import { Op } from 'sequelize'
import { Expense, Hall } from '../models/index.js'
import { responses } from '../utils/responses.js'

const findAllStatistic = async (sort, filter, page = 1, limit = 10) => {
	const whereCondition = {}
	if (filter.userId) whereCondition.userId = filter.userId
	if (filter.hallId) whereCondition.hallId = filter.hallId
	if (filter.title) {
		whereCondition.title = { [Op.iLike]: `%${filter.title}%` }
	}
	if (filter.startDate && filter.endDate) {
		whereCondition.date = {
			[Op.between]: [new Date(filter.startDate), new Date(filter.endDate)],
		}
	}
	const offset = (page - 1) * limit
	return await Expense.findAndCountAll({
		where: whereCondition,
		order: [sort, ['id', 'DESC']],
		include: [
			{ model: Hall, attributes: ['id', 'name', 'deletedAt'], paranoid: false },
		],
		limit: limit,
		offset: offset,
	})
}

const getTotalRevenue = async (filter = {}) => {
	const whereCondition = {}

	if (filter.userId) whereCondition.userId = filter.userId
	if (filter.hallId) whereCondition.hallId = filter.hallId
	if (filter.title) {
		whereCondition.title = { [Op.iLike]: `%${filter.title}%` }
	}
	if (filter.startDate && filter.endDate) {
		whereCondition.date = {
			[Op.between]: [new Date(filter.startDate), new Date(filter.endDate)],
		}
	}
	const result = await Expense.sum('amount', {
		where: whereCondition,
	})
	return result || 0
}

const findById = async id => {
	return await Expense.findByPk(id)
}

const create = async data => {
	return await Expense.create(data)
}

const update = async (id, data) => {
	const expense = await findById(id)
	if (!expense) {
		throw new Error(responses.error.expenseNotFound)
	}
	return await expense.update(data)
}

const remove = async id => {
	const expense = await Expense.findByPk(id)

	if (!expense) {
		throw new Error(responses.error.expenseNotFound)
	}
	await expense.destroy()
}

export default {
	getTotalRevenue,
	findAllStatistic,
	create,
	update,
	remove,
}
