import { imageService } from '../services/index.js'
import { responseSuccess, responseError } from '../utils/responseHelper.js'
import { responses } from '../utils/responses.js'

export const upload = async (req, res) => {
	try {
		if (!req.file) {
			return responseError(res, 400, {
				error: responses.error.errorImageNotProvided,
			})
		}
		const imageUrl = await imageService.uploadImage(req.file)
		responseSuccess(res, 200, { url: imageUrl })
	} catch (error) {
		responseError(res, 500, { error: error.message })
	}
}

export default { upload }
