import { Op } from 'sequelize'
import {
	MemberTransaction,
	Hall,
	Section,
	Subscription,
	Member,
} from '../models/index.js'
import sequelize from '../config/db.js'

const addSubscriptionToMember = async (
	userId,
	memberId,
	hallId,
	sectionId,
	subscriptionId,
	price
) => {
	await MemberTransaction.create({
		userId,
		memberId,
		hallId,
		sectionId,
		subscriptionId,
		amount: price,
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

	if (hallId) whereCondition.hallId = hallId
	if (sectionId) whereCondition.sectionId = sectionId
	if (subscriptionId) whereCondition.subscriptionId = subscriptionId
	if (memberId) whereCondition.memberId = memberId

	if (startDate && endDate) {
		whereCondition.transactionDate = {
			[Op.between]: [new Date(startDate), new Date(endDate)],
		}
	}

	const transactions = await MemberTransaction.findAll({
		where: whereCondition,
		include: [
			{ model: Hall, attributes: ['id', 'name'] },
			{ model: Section, attributes: ['id', 'name', 'description'] },
			{
				model: Subscription,
				attributes: ['id', 'name', 'numberOfSessions', 'price'],
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
			},
		],
	})

	const totalRevenue = transactions.reduce(
		(sum, t) => sum + parseFloat(t.amount),
		0
	)

	const revenueByHalls = await MemberTransaction.findAll({
		attributes: [
			'hallId',
			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
			[sequelize.col('Hall.name'), 'hallName'],
		],
		where: whereCondition,
		group: ['hallId', 'Hall.id'],
		include: [{ model: Hall, attributes: [] }],
	})

	const revenueBySections = await MemberTransaction.findAll({
		attributes: [
			'hallId',
			'sectionId',
			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
			[sequelize.col('Hall.name'), 'hallName'],
			[sequelize.col('Section.name'), 'sectionName'],
			[sequelize.col('Section.description'), 'sectionDescription'],
		],
		where: whereCondition,
		group: ['hallId', 'sectionId', 'Hall.id', 'Section.id'],
		include: [
			{ model: Hall, attributes: [] },
			{ model: Section, attributes: [] },
		],
	})

	const revenueBySubscriptions = await MemberTransaction.findAll({
		attributes: [
			'hallId',
			'sectionId',
			'subscriptionId',
			[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
			[sequelize.col('Hall.name'), 'hallName'],
			[sequelize.col('Section.name'), 'sectionName'],
			[sequelize.col('Subscription.name'), 'subscriptionName'],
			[sequelize.col('Subscription.numberOfSessions'), 'numberOfSessions'],
			[sequelize.col('Subscription.price'), 'price'],
		],
		where: whereCondition,
		group: [
			'hallId',
			'sectionId',
			'subscriptionId',
			'Hall.id',
			'Section.id',
			'Subscription.id',
		],
		include: [
			{ model: Hall, attributes: [] },
			{ model: Section, attributes: [] },
			{ model: Subscription, attributes: [] },
		],
	})

	const spendingByMembers = await MemberTransaction.findAll({
		attributes: [
			'hallId',
			'sectionId',
			'subscriptionId',
			'memberId',
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
		],
		where: whereCondition,
		group: [
			'hallId',
			'sectionId',
			'subscriptionId',
			'memberId',
			'Hall.id',
			'Section.id',
			'Subscription.id',
			'Member.id',
		],
		include: [
			{ model: Hall, attributes: [] },
			{ model: Section, attributes: [] },
			{ model: Subscription, attributes: [] },
			{ model: Member, attributes: [] },
		],
	})

	return {
		totalRevenue,
		revenueByHalls: revenueByHalls.map(hall => ({
			hallId: hall.hallId,
			name: hall.dataValues.hallName,
			totalRevenue: parseFloat(hall.dataValues.totalRevenue) || 0,
		})),
		revenueBySections: revenueBySections.map(section => ({
			hallId: section.hallId,
			sectionId: section.sectionId,
			hallName: section.dataValues.hallName,
			sectionName: section.dataValues.sectionName,
			description: section.dataValues.sectionDescription,
			totalRevenue: parseFloat(section.dataValues.totalRevenue) || 0,
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
		})),
	}
}

export default {
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
