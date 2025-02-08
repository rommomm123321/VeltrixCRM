import { trainerService } from '../services/index.js'
import { responseSuccess, responseError } from '../utils/responseHelper.js'
import { responses } from '../utils/responses.js'
import { requestTrainer } from '../validation/index.js'

const getAllTrainersByUser = async (req, res) => {
	const { id: userId } = req.user
	const {
		filters = {},
		sort = ['createdAt', 'ASC'],
		limit = 10,
		offset = 0,
		...rest
	} = req.query
	try {
		const trainers = await trainerService.getAllTrainersByUser(
			userId,
			{ ...filters, ...rest },
			sort,
			limit,
			offset
		)
		responseSuccess(res, 200, trainers)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const createTrainer = async (req, res) => {
	try {
		await requestTrainer.validateAsync(req.body)
		const newTrainer = await trainerService.createTrainer({
			...req.body,
			userId: req.user.id,
		})
		responseSuccess(res, 201, newTrainer)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const updateTrainer = async (req, res) => {
	try {
		await requestTrainer.validateAsync(req.body)
		const updatedTrainer = await trainerService.updateTrainer(
			req.params.id,
			req.body
		)
		responseSuccess(res, 200, updatedTrainer)
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			responseError(res, 400, {
				error: responses.validation.trainerPhoneUnique,
			})
		} else if (error.isJoi) {
			responseError(res, 400, { error: error.details[0].message })
		} else {
			responseError(res, 500, { error: error.message })
		}
	}
}

const deleteTrainer = async (req, res) => {
	try {
		await trainerService.deleteTrainer(req.params.id)
		responseSuccess(res, 200, null)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

export default {
	getAllTrainersByUser,
	createTrainer,
	updateTrainer,
	deleteTrainer,
}
