import { hallService } from '../services/index.js'
import { requestCreateHall, requestUpdateHall } from '../validation/index.js'
import { responseSuccess, responseError } from '../utils/responseHelper.js'

const getAllHallsByUser = async (req, res) => {
	const { id: userId } = req.user
	const { filters = {}, sort = ['createdAt', 'ASC'] } = req.query
	try {
		const halls = await hallService.getAllHallsByUser(userId, filters, sort)
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
		await requestCreateHall.validateAsync(req.body)
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
		await requestUpdateHall.validateAsync(req.body)
		const updatedHall = await hallService.updateHall(req.params.id, req.body)
		responseSuccess(res, 200, updatedHall)
	} catch (error) {
		responseError(res, 500, { error: error.message })
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
