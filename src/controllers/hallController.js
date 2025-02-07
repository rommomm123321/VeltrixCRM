import { hallService } from '../services/index.js'
import { responseSuccess, responseError } from '../utils/responseHelper.js'
import { responses } from '../utils/responses.js'
import { requestHall } from '../validation/index.js'

const getAllHallsByUser = async (req, res) => {
	const { id: userId } = req.user
	const {
		filters = {},
		sort = ['createdAt', 'ASC'],
		limit = 10,
		offset = 0,
		...rest
	} = req.query
	try {
		const halls = await hallService.getAllHallsByUser(
			userId,
			{ ...filters, ...rest },
			sort,
			limit,
			offset
		)
		responseSuccess(res, 200, halls)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const getHallById = async (req, res) => {
	try {
		const hall = await hallService.getHallById(req.params.id)
		responseSuccess(res, 200, hall)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const createHall = async (req, res) => {
	try {
		await requestHall.validateAsync(req.body)
		const newHall = await hallService.createHall({
			...req.body,
			userId: req.user.id,
		})
		responseSuccess(res, 201, newHall)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const updateHall = async (req, res) => {
	try {
		await requestHall.validateAsync(req.body)
		const updatedHall = await hallService.updateHall(req.params.id, req.body)
		responseSuccess(res, 200, updatedHall)
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			responseError(res, 400, { error: responses.error.hallNameUnique })
		} else if (error.isJoi) {
			responseError(res, 400, { error: error.details[0].message })
		} else {
			responseError(res, 500, { error: error.message })
		}
	}
}

const deleteHall = async (req, res) => {
	try {
		await hallService.deleteHall(req.params.id)
		responseSuccess(res, 200, null)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

export default {
	getAllHallsByUser,
	getHallById,
	createHall,
	updateHall,
	deleteHall,
}
