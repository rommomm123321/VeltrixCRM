import { memberRepository } from '../repositories/index.js'
import { responses } from '../utils/responses.js'

const getAllMembersByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC'],
	limit = 10,
	offset = 0
) => {
	return await memberRepository.findAllByUser(
		userId,
		filters,
		sort,
		limit,
		offset
	)
}

const getMemberById = async id => {
	const hall = await memberRepository.findById(id)
	if (!hall) {
		throw new Error(responses.error.hallNotFound)
	}
	return hall
}

const createMember = async hallData => {
	return await memberRepository.create(hallData)
}

const updateMember = async (id, hallData) => {
	const updatedHall = await memberRepository.update(id, hallData)
	if (!updatedHall) {
		throw new Error(responses.error.hallNotFound)
	}
	return updatedHall
}

export const deleteMember = async ids => {
	if (Array.isArray(ids)) {
		return await memberRepository.removeMany(ids)
	} else {
		return await memberRepository.remove(ids)
	}
}

const getAllMemberSubscriptionsByPhone = async uniqueId => {
	return await memberRepository.findMemberSubscriptionsByPhone(uniqueId)
}

export default {
	getAllMembersByUser,
	getMemberById,
	createMember,
	updateMember,
	deleteMember,
	getAllMemberSubscriptionsByPhone,
}
