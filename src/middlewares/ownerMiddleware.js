import { responses } from '../utils/responses.js'

export const isOwner = (model, ownerField = 'userId') => {
	return async (req, res, next) => {
		const recordId = req.params.id
		const userId = req.user.id
		const record = await model.findByPk(recordId)
		if (!record) {
			return res.status(404).json({ error: responses.error.hallNotFound })
		}
		if (record[ownerField] !== userId) {
			return res.status(403).json({ error: responses.accessDeniedOwner })
		}

		next()
	}
}
