import Joi from 'joi'
import { responses } from '../utils/responses.js'

export const requestVerificationCode = Joi.object({
	email: Joi.string().email().required().messages({
		'string.email': responses.error.invalidEmail,
		'any.required': responses.validation.emailRequired,
	}),
})

export const requestVerifyCode = Joi.object({
	email: Joi.string().email().required().messages({
		'string.email': responses.error.invalidEmail,
		'any.required': responses.validation.emailRequired,
	}),
	verificationCode: Joi.string().length(8).required().messages({
		'string.length': responses.validation.codeLength,
		'any.required': responses.validation.verificationCodeRequired,
	}),
})

export const requestCreateHall = Joi.object({
	name: Joi.string().min(3).max(255).required().messages({
		'string.min': responses.validation.hallNameMin,
		'string.max': responses.validation.hallNameMax,
		'any.required': responses.validation.hallNameRequired,
	}),
})

export const requestUpdateHall = Joi.object({
	name: Joi.string().min(3).max(255).required().messages({
		'string.min': responses.validation.hallNameMin,
		'string.max': responses.validation.hallNameMax,
		'any.required': responses.validation.hallNameRequired,
	}),
})
