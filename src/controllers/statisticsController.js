import statisticService from '../services/statisticService.js'
import { responseSuccess, responseError } from '../utils/responseHelper.js'

const getRevenue = async (req, res) => {
	try {
		const { id: userId } = req.user
		const { startDate, endDate, ...otherFilters } = req.query

		const filter = {
			...otherFilters,
			userId,
			startDate,
			endDate,
		}
		const stats = await statisticService.getRevenue(filter)

		responseSuccess(res, 200, stats)
	} catch (error) {
		console.error(error)
		responseError(res, 500, { error: error.message })
	}
}

const getStatistics = async (req, res) => {
	try {
		const filter = {
			userId: req.user.id,
			memberId: req.query.memberId,
			hallId: req.query.hallId,
			trainerId: req.query.trainerId,
			sectionId: req.query.sectionId,
			subscriptionId: req.query.subscriptionId,
			startDate: req.query.startDate,
			endDate: req.query.endDate,
		}
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10

		const stats = await statisticService.getStatistics(filter, page, limit)

		responseSuccess(res, 200, stats)
	} catch (error) {
		console.error(error)
		responseError(res, 500, { error: error.message })
	}
}

const getStatisticsCSV = async (req, res) => {
	try {
		const filter = {
			userId: req.user.id,
			memberId: req.query.memberId,
			hallId: req.query.hallId,
			trainerId: req.query.trainerId,
			sectionId: req.query.sectionId,
			subscriptionId: req.query.subscriptionId,
			startDate: req.query.startDate,
			endDate: req.query.endDate,
		}
		const page = parseInt(req.query.page) || 1
		const limit = 1000

		const csvData = await statisticService.getStatisticsCSV(filter, page, limit)

		res.setHeader('Content-Type', 'text/csv')
		res.setHeader(
			'Content-Disposition',
			'attachment; filename="statistics.csv"'
		)

		res.send(csvData)
	} catch (error) {
		console.error(error)
		responseError(res, 500, { error: error.message })
	}
}

export default {
	getRevenue,
	getStatistics,
	getStatisticsCSV,
}
