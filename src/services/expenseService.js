import { expenseRepository } from '../repositories/index.js'
import { responses } from '../utils/responses.js'

const getAllExpensesByUser = async (sort, filter, page = 1, limit = 10) => {
	const hasFilters =
		filter.hallId || filter.title || (filter.startDate && filter.endDate)

	const totalRevenue = hasFilters
		? await expenseRepository.getTotalRevenue(filter)
		: await expenseRepository.getTotalRevenue({
				userId: filter.userId,
		  })

	const { count, rows: expenses } = await expenseRepository.findAllStatistic(
		sort,
		filter,
		page,
		limit
	)

	return {
		totalRevenue,
		totalTransactions: count,
		page,
		limit,
		totalPages: Math.ceil(count / limit),
		transactions: expenses.map(t => ({
			id: t.id,
			title: t.title,
			description: t.description,
			amount: t.amount,
			hall: t.Hall,
			date: t.date,
		})),
	}
}

const createExpense = async hallData => {
	return await expenseRepository.create(hallData)
}

const updateExpense = async (id, hallData) => {
	const updatedHall = await expenseRepository.update(id, hallData)
	if (!updatedHall) {
		throw new Error(responses.error.expenseNotFound)
	}
	return updatedHall
}

const deleteExpense = async id => {
	await expenseRepository.remove(id)
}

export default {
	createExpense,
	getAllExpensesByUser,
	updateExpense,
	deleteExpense,
}
