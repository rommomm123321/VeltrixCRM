export const responseSuccess = (res, statusCode, data) => {
	return res.status(statusCode).json({
		status: 'success',
		data: data,
	})
}

export const responseError = (res, statusCode, message) => {
	return res.status(statusCode).json({
		status: 'error',
		message: message,
	})
}
