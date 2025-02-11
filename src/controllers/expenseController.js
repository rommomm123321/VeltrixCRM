import { expenseService } from '../services/index.js'
import { responseSuccess, responseError } from '../utils/responseHelper.js'

const getAllExpensesByUser = async (req, res) => {
	try {
		const filter = {
			userId: req.user.id,
			hallId: req.query.hallId,
			startDate: req.query.startDate,
			endDate: req.query.endDate,
			title: req.query.title,
			sort: req.query.sort,
		}
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const sort = req.query.sort || ['createdAt', 'ASC']
		const expenses = await expenseService.getAllExpensesByUser(
			sort,
			filter,
			page,
			limit
		)
		responseSuccess(res, 200, expenses)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const createExpense = async (req, res) => {
	try {
		// await requestHall.validateAsync(req.body)
		const newHall = await expenseService.createExpense({
			...req.body,
			userId: req.user.id,
		})
		responseSuccess(res, 201, newHall)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const updateExpense = async (req, res) => {
	try {
		// await requestHall.validateAsync(req.body)
		const updatedHall = await expenseService.updateExpense(
			req.params.id,
			req.body
		)
		responseSuccess(res, 200, updatedHall)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const deleteExpense = async (req, res) => {
	try {
		await expenseService.deleteExpense(req.params.id)
		responseSuccess(res, 200, null)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

export default {
	createExpense,
	getAllExpensesByUser,
	updateExpense,
	deleteExpense,
}
