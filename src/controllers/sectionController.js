import { sectionService } from '../services/index.js'
import { responseError, responseSuccess } from '../utils/responseHelper.js'
import { responses } from '../utils/responses.js'
import { requestSection } from '../validation/index.js'

const getAllSectionsByUser = async (req, res) => {
	const { id: userId } = req.user
	const {
		filters = {},
		sort = ['createdAt', 'ASC'],
		limit = 10,
		offset = 0,
		...rest
	} = req.query
	try {
		const sections = await sectionService.getAllSectionsByUser(
			userId,
			{ ...filters, ...rest },
			sort,
			limit,
			offset
		)
		responseSuccess(res, 200, sections)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const getSectionById = async (req, res) => {
	try {
		const section = await sectionService.getSectionById(req.params.id)
		responseSuccess(res, 200, section)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

const createSection = async (req, res) => {
	const { id: userId } = req.user
	const { hallIds = [], ...sectionData } = req.body
	try {
		await requestSection.validateAsync(req.body)
		const newSection = await sectionService.createSection(
			{
				...sectionData,
				userId,
			},
			hallIds
		)
		responseSuccess(res, 201, newSection)
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			responseError(res, 400, { error: responses.error.sectionNameUnique })
		} else if (error.isJoi) {
			responseError(res, 400, { error: error.details[0].message })
		} else {
			responseError(res, 500, { error: error.message })
		}
	}
}

const updateSection = async (req, res) => {
	const { id: userId } = req.user
	const { hallIds = [], ...sectionData } = req.body
	try {
		await requestSection.validateAsync(req.body)
		const updatedSection = await sectionService.updateSection(
			req.params.id,
			sectionData,
			hallIds,
			userId
		)
		responseSuccess(res, 200, updatedSection)
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			responseError(res, 400, { error: responses.error.sectionNameUnique })
		} else if (error.isJoi) {
			responseError(res, 400, { error: error.details[0].message })
		} else {
			responseError(res, 500, { error: error.message })
		}
	}
}

const deleteSection = async (req, res) => {
	try {
		const ids = req.body.id || req.params.id

		if (!ids) {
			return responseError(res, 400, {
				error: responses.error.noIdsProvidedForDeletion,
			})
		}

		await sectionService.deleteSection(ids)
		responseSuccess(res, 200, null)
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

export default {
	getAllSectionsByUser,
	getSectionById,
	createSection,
	updateSection,
	deleteSection,
}
