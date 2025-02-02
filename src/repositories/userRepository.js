import { User } from '../models/index.js'
import { responses } from '../utils/responses.js'

const findAll = async () => {
	return await User.findAll()
}

const findUserByEmail = async email => {
	return await User.findOne({ where: { email } })
}

const findById = async id => {
	return await User.findByPk(id)
}

export const findOrCreateUser = async (email, defaults) => {
	const [user, created] = await User.findOrCreate({
		where: { email },
		defaults,
	})
	return { user, created }
}

const create = async data => {
	return await User.create(data)
}

const updateUser = async (id, data) => {
	const user = await findById(id)
	if (!user) {
		throw new Error(responses.error.userNotFound)
	}
	return await user.update(data)
}

const remove = async id => {
	const user = await User.findByPk(id)
	if (!user) {
		throw new Error(responses.error.userNotFound)
	}
	return await user.destroy()
}

export default {
	findAll,
	findById,
	findUserByEmail,
	findOrCreateUser,
	create,
	updateUser,
	remove,
}
