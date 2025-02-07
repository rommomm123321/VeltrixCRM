import express from 'express'
import { statisticsController } from '../controllers/index.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get(
	'/statistics/revenue',
	authenticate,
	statisticsController.getStatistics
)
router.get(
	'/download-statistics-csv',
	authenticate,
	statisticsController.getStatisticsCSV
)

export default router
