import { verifyToken } from '../utils/jwt.js'
import { responses } from '../utils/responses.js'

export const authenticate = (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '')

	if (!token) {
		return res.status(401).json({ error: responses.unauthorized.accessDenied })
	}

	try {
		const decoded = verifyToken(token)
		req.user = decoded
		next()
	} catch (error) {
		res
			.status(401)
			.json({ error: responses.unauthorized.invalidOrExpiredToken })
	}
}
