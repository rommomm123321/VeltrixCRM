import { memberRepository } from '../repositories/index.js'
import { responses } from '../utils/responses.js'

const getAllMembersByUser = async (
	userId,
	filters = {},
	sort = ['createdAt', 'ASC']
) => {
	return await memberRepository.findAllByUser(userId, filters, sort)
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

export default {
	getAllMembersByUser,
	getMemberById,
	createMember,
	updateMember,
	deleteMember,
}
