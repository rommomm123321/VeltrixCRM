import moment from 'moment'
import { memberTransactionRepository } from '../repositories/index.js'

const getRevenue = async filter => {
	const stats = await memberTransactionRepository.getRevenue(filter)

	const revenueByHalls = stats.revenueByHalls.map(hall => ({
		hallId: hall.hallId,
		hallName: hall.name,
		revenue: hall.totalRevenue || 0,
		sections: stats.revenueBySections
			.filter(section => section.hallId === hall.hallId)
			.map(section => ({
				sectionId: section.sectionId,
				sectionName: section.sectionName,
				description: section.description,
				revenue: section.totalRevenue || 0,
				subscriptions: stats.revenueBySubscriptions
					.filter(
						sub =>
							sub.hallId === hall.hallId && sub.sectionId === section.sectionId
					)
					.map(subscription => ({
						subscriptionId: subscription.subscriptionId,
						subscriptionName: subscription.subscriptionName,
						numberOfSessions: subscription.numberOfSessions,
						price: subscription.price,
						revenue: subscription.totalRevenue || 0,
						members: stats.spendingByMembers
							.filter(
								member =>
									member.hallId === hall.hallId &&
									member.sectionId === section.sectionId &&
									member.subscriptionId === subscription.subscriptionId
							)
							.map(member => ({
								memberId: member.memberId,
								firstName: member.firstName,
								lastName: member.lastName,
								age: member.age,
								gender: member.gender,
								phone: member.phone,
								email: member.email,
								totalSpent: member.totalSpent || 0,
								transactionDate: member.transactionDate,
							})),
					})),
			})),
	}))

	return {
		totalRevenue: stats.totalRevenue,
		revenueByHalls,
	}
}

const BOM = '\uFEFF'

const getStatistics = async (filter, page = 1, limit = 10) => {
	const hasFilters =
		filter.memberId ||
		filter.hallId ||
		filter.trainerId ||
		filter.sectionId ||
		filter.subscriptionId ||
		(filter.startDate && filter.endDate)

	const totalRevenue = hasFilters
		? await memberTransactionRepository.getTotalRevenue(filter)
		: await memberTransactionRepository.getTotalRevenue({
				userId: filter.userId,
		  })

	const { count, rows: transactions } =
		await memberTransactionRepository.findAllStatistic(filter, page, limit)

	return {
		totalRevenue,
		totalTransactions: count,
		page,
		limit,
		totalPages: Math.ceil(count / limit),
		transactions: transactions.map(t => ({
			id: t.id,
			amount: t.amount,
			transactionDate: t.transactionDate,
			member: t.Member,
			hall: t.Hall,
			trainer: t.Trainer,
			section: t.Section,
			subscription: t.Subscription,
		})),
	}
}

const getStatisticsCSV = async (filter, page = 1, limit = 10) => {
	const statistics = await getStatistics(filter, page, limit)
	const transactions = statistics.transactions.map(transaction => {
		const member = transaction.member || { firstName: 'Unknown', lastName: '' }
		const hall = transaction.hall || { name: 'Unknown Hall' }
		const section = transaction.section || { name: 'Unknown Section' }
		const subscription = transaction.subscription || {
			name: 'Unknown Subscription',
		}
		const formattedDate = moment(transaction.transactionDate).format(
			'DD.MM.YYYY - HH:mm'
		)

		return {
			'Transaction Date': formattedDate,
			Hall: hall.name,
			Section: section.name,
			Subscription: subscription.name,
			Member: `${member.firstName} ${member.lastName}`,
			Amount: transaction.amount,
		}
	})

	const csvData = jsonToCsv(transactions)

	const encodedCsvData = BOM + csvData

	return Buffer.from(encodedCsvData, 'utf-8')
}

const jsonToCsv = jsonArray => {
	const header = Object.keys(jsonArray[0])
	const rows = jsonArray.map(obj =>
		header
			.map(fieldName => {
				let value = obj[fieldName]
				if (
					typeof value === 'string' &&
					(value.includes(',') || value.includes('"'))
				) {
					value = `"${value.replace(/"/g, '""')}"`
				}
				return value
			})
			.join(',')
	)
	const csvContent = [header.join(','), ...rows].join('\n')
	return csvContent
}

export default {
	getRevenue,
	getStatistics,
	getStatisticsCSV,
}
