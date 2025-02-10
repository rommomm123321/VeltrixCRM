import { Op } from 'sequelize'
import {
	MemberTransaction,
	Hall,
	Section,
	Subscription,
	Member,
	Trainer,
} from '../models/index.js'
import sequelize from '../config/db.js'

const addSubscriptionToMember = async (
	userId,
	memberId,
	trainerId,
	hallId,
	sectionId,
	subscriptionId,
	price,
	transactionDate
) => {
	await MemberTransaction.create({
		userId: parseInt(userId, 10),
		memberId: parseInt(memberId, 10),
		trainerId: trainerId ? parseInt(trainerId, 10) : null,
		hallId: parseInt(hallId, 10),
		sectionId: parseInt(sectionId, 10),
		subscriptionId: parseInt(subscriptionId, 10),
		amount: price,
		transactionDate,
	})
}

const getRevenueByHall = async (hallId, userId) => {
	return await MemberTransaction.sum('amount', {
		where: { hallId, userId },
	})
}

const getRevenueBySection = async (sectionId, userId) => {
	return await MemberTransaction.sum('amount', {
		where: { sectionId, userId },
	})
}

const getRevenueBySubscription = async (subscriptionId, userId) => {
	return await MemberTransaction.sum('amount', {
		where: { subscriptionId, userId },
	})
}

const getTotalSpendingByMember = async (memberId, userId) => {
	return await MemberTransaction.sum('amount', {
		where: { memberId, userId },
	})
}

const getRevenueBySectionInHall = async (hallId, sectionId) => {
	return await MemberTransaction.sum('amount', { where: { hallId, sectionId } })
}

const getRevenueBySubscriptionInSection = async (sectionId, subscriptionId) => {
	return await MemberTransaction.sum('amount', {
		where: { sectionId, subscriptionId },
	})
}

const getRevenueByHallForPeriod = async (hallId, startDate, endDate) => {
	return await MemberTransaction.sum('amount', {
		where: {
			hallId,
			transactionDate: {
				[Op.between]: [startDate, endDate],
			},
		},
	})
}

const getRevenueBySectionForPeriod = async (sectionId, startDate, endDate) => {
	return await MemberTransaction.sum('amount', {
		where: {
			sectionId,
			transactionDate: {
				[Op.between]: [startDate, endDate],
			},
		},
	})
}

const getRevenueBySubscriptionForPeriod = async (
	subscriptionId,
	startDate,
	endDate
) => {
	return await MemberTransaction.sum('amount', {
		where: {
			subscriptionId,
			transactionDate: {
				[Op.between]: [startDate, endDate],
			},
		},
	})
}

const getRevenueBySectionInHallForPeriod = async (
	hallId,
	sectionId,
	startDate,
	endDate
) => {
	return await MemberTransaction.sum('amount', {
		where: {
			hallId,
			sectionId,
			transactionDate: {
				[Op.between]: [startDate, endDate],
			},
		},
	})
}

const getRevenueBySubscriptionInSectionForPeriod = async (
	sectionId,
	subscriptionId,
	startDate,
	endDate
) => {
	return await MemberTransaction.sum('amount', {
		where: {
			sectionId,
			subscriptionId,
			transactionDate: {
				[Op.between]: [startDate, endDate],
			},
		},
	})
}

const getTotalSpendingByMemberForPeriod = async (
	memberId,
	startDate,
	endDate
) => {
	return await MemberTransaction.sum('amount', {
		where: {
			memberId,
			transactionDate: {
				[Op.between]: [startDate, endDate],
			},
		},
	})
}

const getRevenueByPeriod = async (whereCondition, period) => {
	const today = new Date()
	let startDate

	switch (period) {
		case 'day':
			startDate = new Date(today.setHours(0, 0, 0, 0))
			break
		case 'week':
			startDate = new Date(today.setDate(today.getDate() - 7))
			break
		case 'month':
			startDate = new Date(today.setMonth(today.getMonth() - 1))
			break
		case 'year':
			startDate = new Date(today.setFullYear(today.getFullYear() - 1))
			break
		default:
			startDate = null
	}

	const whereClause = startDate
		? { ...whereCondition, transactionDate: { [Op.gte]: startDate } }
		: whereCondition

	return await MemberTransaction.sum('amount', { where: whereClause })
}

// const getRevenue = async filter => {
// 	const {
// 		hallId,
// 		sectionId,
// 		subscriptionId,
// 		memberId,
// 		startDate,
// 		endDate,
// 		userId,
// 	} = filter

// 	const whereCondition = { userId }

// 	if (hallId) whereCondition.hallId = hallId
// 	if (sectionId) whereCondition.sectionId = sectionId
// 	if (subscriptionId) whereCondition.subscriptionId = subscriptionId
// 	if (memberId) whereCondition.memberId = memberId

// 	if (startDate && endDate) {
// 		whereCondition.transactionDate = {
// 			[Op.between]: [new Date(startDate), new Date(endDate)],
// 		}
// 	}
// 	const transactions = await MemberTransaction.findAll({
// 		where: whereCondition,
// 	})

// 	const totalRevenue = transactions.reduce(
// 		(sum, t) => sum + parseFloat(t.amount),
// 		0
// 	)

// 	const revenueByHalls = await MemberTransaction.findAll({
// 		attributes: [
// 			'hallId',
// 			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
// 		],
// 		where: whereCondition,
// 		group: ['hallId'],
// 	})

// 	const revenueBySections = await MemberTransaction.findAll({
// 		attributes: [
// 			'hallId',
// 			'sectionId',
// 			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
// 		],
// 		where: whereCondition,
// 		group: ['hallId', 'sectionId'],
// 	})

// 	const revenueBySubscriptions = await MemberTransaction.findAll({
// 		attributes: [
// 			'hallId',
// 			'sectionId',
// 			'subscriptionId',
// 			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
// 		],
// 		where: whereCondition,
// 		group: ['hallId', 'sectionId', 'subscriptionId'],
// 	})

// 	const spendingByMembers = await MemberTransaction.findAll({
// 		attributes: [
// 			'hallId',
// 			'sectionId',
// 			'subscriptionId',
// 			'memberId',
// 			[sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent'],
// 		],
// 		where: whereCondition,
// 		group: ['hallId', 'sectionId', 'subscriptionId', 'memberId'],
// 	})

// 	return {
// 		totalRevenue,
// 		revenueByHalls: revenueByHalls.map(hall => ({
// 			hallId: hall.hallId,
// 			totalRevenue: parseFloat(hall.dataValues.totalRevenue) || 0,
// 		})),
// 		revenueBySections: revenueBySections.map(section => ({
// 			hallId: section.hallId,
// 			sectionId: section.sectionId,
// 			totalRevenue: parseFloat(section.dataValues.totalRevenue) || 0,
// 		})),
// 		revenueBySubscriptions: revenueBySubscriptions.map(subscription => ({
// 			hallId: subscription.hallId,
// 			sectionId: subscription.sectionId,
// 			subscriptionId: subscription.subscriptionId,
// 			totalRevenue: parseFloat(subscription.dataValues.totalRevenue) || 0,
// 		})),
// 		spendingByMembers: spendingByMembers.map(member => ({
// 			hallId: member.hallId,
// 			sectionId: member.sectionId,
// 			subscriptionId: member.subscriptionId,
// 			memberId: member.memberId,
// 			totalSpent: parseFloat(member.dataValues.totalSpent) || 0,
// 		})),
// 	}
// }

const getRevenue = async filter => {
	const {
		hallId,
		sectionId,
		subscriptionId,
		memberId,
		startDate,
		endDate,
		userId,
	} = filter

	const whereCondition = { userId }

	if (hallId) whereCondition['Hall.id'] = hallId
	if (sectionId) whereCondition['Section.id'] = sectionId
	if (subscriptionId) whereCondition['Subscription.id'] = subscriptionId
	if (memberId) whereCondition['Member.id'] = memberId

	if (startDate && endDate) {
		whereCondition.transactionDate = {
			[Op.between]: [new Date(startDate), new Date(endDate)],
		}
	}

	const transactions = await MemberTransaction.findAll({
		where: whereCondition,
		include: [
			{ model: Hall, attributes: ['id', 'name'], as: 'Hall' },
			{
				model: Section,
				attributes: ['id', 'name', 'description'],
				as: 'Section',
			},
			{
				model: Subscription,
				attributes: ['id', 'name', 'numberOfSessions', 'price'],
				as: 'Subscription',
			},
			{
				model: Member,
				attributes: [
					'id',
					'firstName',
					'lastName',
					'age',
					'gender',
					'phone',
					'email',
				],
				as: 'Member',
			},
		],
	})

	const totalRevenue = transactions.reduce(
		(sum, t) => sum + parseFloat(t.amount),
		0
	)

	const revenueByHalls = await MemberTransaction.findAll({
		attributes: [
			[sequelize.col('Hall.id'), 'hallId'],
			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
			[sequelize.col('Hall.name'), 'hallName'],
			[sequelize.col('MemberTransaction.transactionDate'), 'transactionDate'],
		],
		where: whereCondition,
		group: ['Hall.id', 'MemberTransaction.transactionDate'], // Added transactionDate here
		include: [{ model: Hall, attributes: [], as: 'Hall' }],
	})

	const revenueBySections = await MemberTransaction.findAll({
		attributes: [
			[sequelize.col('Hall.id'), 'hallId'],
			[sequelize.col('Section.id'), 'sectionId'],
			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
			[sequelize.col('Hall.name'), 'hallName'],
			[sequelize.col('Section.name'), 'sectionName'],
			[sequelize.col('Section.description'), 'sectionDescription'],
			[sequelize.col('MemberTransaction.transactionDate'), 'transactionDate'],
		],
		where: whereCondition,
		group: ['Hall.id', 'Section.id', 'MemberTransaction.transactionDate'], // Added transactionDate here
		include: [
			{ model: Hall, attributes: [], as: 'Hall' },
			{ model: Section, attributes: [], as: 'Section' },
		],
	})

	const revenueBySubscriptions = await MemberTransaction.findAll({
		attributes: [
			[sequelize.col('Hall.id'), 'hallId'],
			[sequelize.col('Section.id'), 'sectionId'],
			[sequelize.col('Subscription.id'), 'subscriptionId'],
			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
			[sequelize.col('Hall.name'), 'hallName'],
			[sequelize.col('Section.name'), 'sectionName'],
			[sequelize.col('Subscription.name'), 'subscriptionName'],
			[sequelize.col('Subscription.numberOfSessions'), 'numberOfSessions'],
			[sequelize.col('Subscription.price'), 'price'],
			[sequelize.col('MemberTransaction.transactionDate'), 'transactionDate'],
		],
		where: whereCondition,
		group: [
			'Hall.id',
			'Section.id',
			'Subscription.id',
			'MemberTransaction.transactionDate',
		],
		include: [
			{ model: Hall, attributes: [], as: 'Hall' },
			{ model: Section, attributes: [], as: 'Section' },
			{ model: Subscription, attributes: [], as: 'Subscription' },
		],
	})

	const spendingByMembers = await MemberTransaction.findAll({
		attributes: [
			[sequelize.col('Hall.id'), 'hallId'],
			[sequelize.col('Section.id'), 'sectionId'],
			[sequelize.col('Subscription.id'), 'subscriptionId'],
			[sequelize.col('Member.id'), 'memberId'],
			[sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent'],
			[sequelize.col('Hall.name'), 'hallName'],
			[sequelize.col('Section.name'), 'sectionName'],
			[sequelize.col('Subscription.name'), 'subscriptionName'],
			[sequelize.col('Subscription.numberOfSessions'), 'numberOfSessions'],
			[sequelize.col('Subscription.price'), 'price'],
			[sequelize.col('Member.firstName'), 'firstName'],
			[sequelize.col('Member.lastName'), 'lastName'],
			[sequelize.col('Member.age'), 'age'],
			[sequelize.col('Member.gender'), 'gender'],
			[sequelize.col('Member.phone'), 'phone'],
			[sequelize.col('Member.email'), 'email'],
			[sequelize.col('MemberTransaction.transactionDate'), 'transactionDate'],
		],
		where: whereCondition,
		group: [
			'Hall.id',
			'Section.id',
			'Subscription.id',
			'Member.id',
			'MemberTransaction.transactionDate',
		],
		include: [
			{ model: Hall, attributes: [], as: 'Hall' },
			{ model: Section, attributes: [], as: 'Section' },
			{ model: Subscription, attributes: [], as: 'Subscription' },
			{ model: Member, attributes: [], as: 'Member' },
		],
	})

	return {
		totalRevenue,
		revenueByHalls: revenueByHalls.map(hall => ({
			hallId: hall.hallId,
			name: hall.dataValues.hallName,
			totalRevenue: parseFloat(hall.dataValues.totalRevenue) || 0,
			transactionDate: hall.dataValues.transactionDate,
		})),
		revenueBySections: revenueBySections.map(section => ({
			hallId: section.hallId,
			sectionId: section.sectionId,
			hallName: section.dataValues.hallName,
			sectionName: section.dataValues.sectionName,
			description: section.dataValues.sectionDescription,
			totalRevenue: parseFloat(section.dataValues.totalRevenue) || 0,
			transactionDate: section.dataValues.transactionDate,
		})),
		revenueBySubscriptions: revenueBySubscriptions.map(subscription => ({
			hallId: subscription.hallId,
			sectionId: subscription.sectionId,
			subscriptionId: subscription.subscriptionId,
			hallName: subscription.dataValues.hallName,
			sectionName: subscription.dataValues.sectionName,
			subscriptionName: subscription.dataValues.subscriptionName,
			numberOfSessions: subscription.dataValues.numberOfSessions,
			price: parseFloat(subscription.dataValues.price) || 0,
			totalRevenue: parseFloat(subscription.dataValues.totalRevenue) || 0,
			transactionDate: subscription.dataValues.transactionDate,
		})),
		spendingByMembers: spendingByMembers.map(member => ({
			hallId: member.hallId,
			sectionId: member.sectionId,
			subscriptionId: member.subscriptionId,
			memberId: member.memberId,
			hallName: member.dataValues.hallName,
			sectionName: member.dataValues.sectionName,
			subscriptionName: member.dataValues.subscriptionName,
			numberOfSessions: member.dataValues.numberOfSessions,
			price: parseFloat(member.dataValues.price) || 0,
			firstName: member.dataValues.firstName,
			lastName: member.dataValues.lastName,
			age: member.dataValues.age,
			gender: member.dataValues.gender,
			phone: member.dataValues.phone,
			email: member.dataValues.email,
			totalSpent: parseFloat(member.dataValues.totalSpent) || 0,
			transactionDate: member.dataValues.transactionDate,
		})),
	}
}

const findAllStatistic = async (filter, page = 1, limit = 10) => {
	const whereCondition = {}

	if (filter.userId) whereCondition.userId = filter.userId
	if (filter.memberId) whereCondition.memberId = filter.memberId
	if (filter.hallId) whereCondition.hallId = filter.hallId
	if (filter.trainerId) whereCondition.trainerId = filter.trainerId
	if (filter.sectionId) whereCondition.sectionId = filter.sectionId
	if (filter.subscriptionId)
		whereCondition.subscriptionId = filter.subscriptionId

	if (filter.startDate && filter.endDate) {
		whereCondition.transactionDate = {
			[Op.between]: [new Date(filter.startDate), new Date(filter.endDate)],
		}
	}
	const offset = (page - 1) * limit

	return await MemberTransaction.findAndCountAll({
		where: whereCondition,
		order: [['transactionDate', 'DESC']],
		include: [
			{ model: Hall, attributes: ['id', 'name', 'deletedAt'], paranoid: false },
			{
				model: Trainer,
				attributes: [
					'id',
					'firstName',
					'lastName',
					'age',
					'gender',
					'phone',
					'deletedAt',
				],
				paranoid: false,
			},
			{
				model: Section,
				attributes: ['id', 'name', 'description', 'deletedAt'],
				paranoid: false,
			},
			{
				model: Subscription,
				attributes: ['id', 'name', 'numberOfSessions', 'price', 'deletedAt'],
				paranoid: false,
			},
			{
				model: Member,
				attributes: [
					'id',
					'firstName',
					'lastName',
					'age',
					'gender',
					'phone',
					'email',
					'deletedAt',
				],
				paranoid: false,
			},
		],
		limit: limit,
		offset: offset,
	})
}

const getTotalRevenue = async (filter = {}) => {
	const whereCondition = {}

	if (filter.userId) whereCondition.userId = filter.userId
	if (filter.memberId) whereCondition.memberId = filter.memberId
	if (filter.hallId) whereCondition.hallId = filter.hallId
	if (filter.trainerId) whereCondition.trainerId = filter.trainerId
	if (filter.sectionId) whereCondition.sectionId = filter.sectionId
	if (filter.subscriptionId)
		whereCondition.subscriptionId = filter.subscriptionId

	if (filter.startDate && filter.endDate) {
		whereCondition.transactionDate = {
			[Op.between]: [new Date(filter.startDate), new Date(filter.endDate)],
		}
	}

	const result = await MemberTransaction.sum('amount', {
		where: whereCondition,
	})
	return result || 0
}

export default {
	getTotalRevenue,
	findAllStatistic,
	getRevenue,
	addSubscriptionToMember,
	getRevenueByHall,
	getRevenueBySection,
	getRevenueBySubscription,
	getTotalSpendingByMember,
	getRevenueBySectionInHall,
	getRevenueBySubscriptionInSection,
	getRevenueByHallForPeriod,
	getRevenueBySectionForPeriod,
	getRevenueBySubscriptionForPeriod,
	getRevenueBySectionInHallForPeriod,
	getRevenueBySubscriptionInSectionForPeriod,
	getTotalSpendingByMemberForPeriod,
	getRevenueByPeriod,
}
