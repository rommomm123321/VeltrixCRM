import axios from 'axios'
import FormData from 'form-data'
import 'dotenv/config'
import { responses } from '../utils/responses.js'

const uploadImage = async imageFile => {
	const data = new FormData()
	data.append('image', imageFile.buffer, { filename: imageFile.originalname })
	try {
		const response = await axios.post(
			`https://api.imgbb.com/1/upload?expiration=15552000&key=${process.env.IMGBB_API_KEY}`,
			data,
			{
				headers: {
					accept: 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
				},
			}
		)
		if (response.data && response.data.data) {
			return response.data.data.image.url
		} else {
			throw new Error(responses.error.imageUploadFailed)
		}
	} catch (error) {
		throw error
	}
}

export default { uploadImage }
