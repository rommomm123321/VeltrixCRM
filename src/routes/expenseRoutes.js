import express from 'express'
import { expenseController } from '../controllers/index.js'
import { isOwner } from '../middlewares/ownerMiddleware.js'
import { Expense } from '../models/index.js'
import { authenticate } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.post('/expenses', authenticate, expenseController.createExpense)
router.get('/expenses', authenticate, expenseController.getAllExpensesByUser)
router.put(
	'/expenses/:id',
	authenticate,
	isOwner(Expense),
	expenseController.updateExpense
)
router.delete(
	'/expenses/:id',
	authenticate,
	isOwner(Expense),
	expenseController.deleteExpense
)

router.get(
	'/expenses/download-statistics-csv',
	authenticate,
	expenseController.getStatisticsCSV
)

export default router
