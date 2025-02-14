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

export const requestHall = Joi.object({
	name: Joi.string().min(3).max(255).required().messages({
		'string.min': responses.validation.hallNameMin,
		'string.max': responses.validation.hallNameMax,
		'any.required': responses.validation.hallNameRequired,
	}),
	image_url: Joi.optional(),
})

export const requestSection = Joi.object({
	name: Joi.string().min(3).max(255).required().messages({
		'string.min': responses.validation.sectionNameMin,
		'string.max': responses.validation.sectionNameMax,
		'any.required': responses.validation.sectionNameRequired,
	}),
	description: Joi.string().max(1000).optional().messages({
		'string.max': responses.validation.sectionDescriptionMax,
	}),
	hallIds: Joi.array().items(Joi.number().integer()).optional().messages({
		'array.base': responses.validation.sectionHallIdsArray,
		'number.base': responses.validation.sectionHallIdsItems,
	}),
	trainerId: Joi.number().integer().optional().allow(null).messages({
		'number.base': responses.validation.trainerIdInvalid,
	}),
})

export const requestCreateSubscription = Joi.object({
	name: Joi.string().min(3).max(255).required().messages({
		'string.min': responses.validation.subscriptionNameMin,
		'string.max': responses.validation.subscriptionNameMax,
		'any.required': responses.validation.subscriptionNameRequired,
	}),
	numberOfSessions: Joi.number().integer().min(1).required().messages({
		'number.base': responses.validation.subscriptionNumberOfSessionsInteger,
		'number.min': responses.validation.subscriptionNumberOfSessionsMin,
		'any.required': responses.validation.subscriptionNumberOfSessionsRequired,
	}),
	price: Joi.number().precision(2).positive().required().messages({
		'number.base': responses.validation.subscriptionPriceNumber,
		'number.precision': responses.validation.subscriptionPricePrecision,
		'number.positive': responses.validation.subscriptionPricePositive,
		'any.required': responses.validation.subscriptionPriceRequired,
	}),
	sectionIds: Joi.array().items(Joi.number().integer()).optional().messages({
		'array.base': responses.validation.subscriptionSectionIdsArray,
		'number.base': responses.validation.subscriptionSectionIdsItems,
	}),
})

export const requestUpdateSubscription = Joi.object({
	name: Joi.string().min(3).max(255).required().messages({
		'string.min': responses.validation.subscriptionNameMin,
		'string.max': responses.validation.subscriptionNameMax,
		'any.required': responses.validation.subscriptionNameRequired,
	}),
	price: Joi.number().precision(2).positive().required().messages({
		'number.base': responses.validation.subscriptionPriceNumber,
		'number.precision': responses.validation.subscriptionPricePrecision,
		'number.positive': responses.validation.subscriptionPricePositive,
		'any.required': responses.validation.subscriptionPriceRequired,
	}),
	sectionIds: Joi.array().items(Joi.number().integer()).optional().messages({
		'array.base': responses.validation.subscriptionSectionIdsArray,
		'number.base': responses.validation.subscriptionSectionIdsItems,
	}),
})

export const requestMember = Joi.object({
	firstName: Joi.string().min(2).max(255).required().messages({
		'string.min': responses.validation.memberFirstNameMin,
		'string.max': responses.validation.memberFirstNameMax,
		'any.required': responses.validation.memberFirstNameRequired,
	}),
	lastName: Joi.string().min(2).max(255).required().messages({
		'string.min': responses.validation.memberLastNameMin,
		'string.max': responses.validation.memberLastNameMax,
		'any.required': responses.validation.memberLastNameRequired,
	}),
	age: Joi.number().min(6).max(100).required().messages({
		'number.min': responses.validation.memberAgeMin,
		'number.max': responses.validation.memberAgeMax,
		'any.required': responses.validation.memberAgeRequired,
	}),
	gender: Joi.string().valid('male', 'female', 'other').required().messages({
		'any.required': responses.validation.memberGenderRequired,
		'string.valid': responses.validation.memberGenderValid,
	}),
	phone: Joi.string().max(200).allow(null).optional(),
	email: Joi.string().max(200).allow(null).optional(),
	registrationDate: Joi.date().allow(null).optional(),
	hallId: Joi.number().integer().required().messages({
		'number.base': responses.validation.memberHallIdNumber,
		'any.required': responses.validation.memberHallIdRequired,
	}),
	sections: Joi.array()
		.items(
			Joi.object({
				sectionId: Joi.number().integer().required().messages({
					'number.base': responses.validation.memberSectionIdNumber,
					'any.required': responses.validation.memberSectionIdRequired,
				}),
				subscriptionId: Joi.number().integer().required().messages({
					'number.base': responses.validation.memberSubscriptionIdNumber,
					'any.required': responses.validation.memberSubscriptionIdRequired,
				}),
			})
		)
		.optional()
		.messages({
			'array.base': responses.validation.memberSectionsArray,
		}),
})

export const requestTrainer = Joi.object({
	firstName: Joi.string().min(2).max(255).required().messages({
		'string.min': responses.validation.trainerFirstNameMin,
		'string.max': responses.validation.trainerFirstNameMax,
		'any.required': responses.validation.trainerFirstNameRequired,
	}),
	lastName: Joi.string().min(2).max(255).required().messages({
		'string.min': responses.validation.trainerLastNameMin,
		'string.max': responses.validation.trainerLastNameMax,
		'any.required': responses.validation.trainerLastNameRequired,
	}),
	dateOfBirth: Joi.date().required().messages({
		'any.required': responses.validation.trainerDateOfBirthRequired,
	}),
	gender: Joi.string().valid('male', 'female', 'other').required().messages({
		'any.only': responses.validation.trainerGenderInvalid,
		'any.required': responses.validation.trainerGenderRequired,
	}),
	phone: Joi.string()
		.pattern(/^\d{10,15}$/)
		.required()
		.messages({
			'string.pattern.base': responses.validation.trainerPhoneInvalid,
			'any.required': responses.validation.trainerPhoneRequired,
		}),
})

export const requestTrackVisit = Joi.object({
	memberId: Joi.number().integer().required().messages({
		'number.base': responses.validation.trackVisitMemberIdNumber,
		'any.required': responses.validation.trackVisitMemberIdRequired,
	}),
	sectionId: Joi.number().integer().required().messages({
		'number.base': responses.validation.trackVisitSectionIdNumber,
		'any.required': responses.validation.trackVisitSectionIdRequired,
	}),
})

export const requestRenewSubscription = Joi.object({
	memberId: Joi.number().integer().required().messages({
		'number.base': responses.validation.renewSubscriptionMemberIdNumber,
		'any.required': responses.validation.renewSubscriptionMemberIdRequired,
	}),
	sectionId: Joi.number().integer().required().messages({
		'number.base': responses.validation.renewSubscriptionSectionIdNumber,
		'any.required': responses.validation.renewSubscriptionSectionIdRequired,
	}),
	subscriptionId: Joi.number().integer().required().messages({
		'number.base': responses.validation.renewSubscriptionSubscriptionIdNumber,
		'any.required':
			responses.validation.renewSubscriptionSubscriptionIdRequired,
	}),
})
