import moment from 'moment'
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

const getStatisticsCSV = async (sort, filter, page = 1, limit = 10) => {
	const statistics = await getAllExpensesByUser(sort, filter, page, limit)
	const expenses = statistics.transactions.map(expense => {
		const title = expense.title
		const hall = expense.hall
		const description = expense.description
		const amount = expense.amount
		const formattedDate = moment(expense.date).format('DD.MM.YYYY - HH:mm')

		return {
			'Дата оплати': formattedDate,
			Зал: hall.name,
			Назва: title,
			Опис: description,
			Сума: amount,
		}
	})

	const csvData = jsonToCsv(expenses)

	const BOM = '\uFEFF'
	const encodedCsvData = BOM + csvData

	return Buffer.from(encodedCsvData, 'utf-8')
}

const jsonToCsv = jsonArray => {
	const header = Object.keys(jsonArray[0])
	const rows = jsonArray.map(obj =>
		header
			.map(fieldName => {
				let value = obj[fieldName]
				if (
					typeof value === 'string' &&
					(value.includes(',') || value.includes('"'))
				) {
					value = `"${value.replace(/"/g, '""')}"`
				}
				return value
			})
			.join(',')
	)
	const csvContent = [header.join(','), ...rows].join('\n')
	return csvContent
}

export default {
	createExpense,
	getAllExpensesByUser,
	updateExpense,
	deleteExpense,
	getStatisticsCSV,
}
