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

export default {
	getRevenue,
}
