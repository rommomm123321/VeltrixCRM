import { memberTransactionRepository } from '../repositories/index.js'

const getRevenue = async filter => {
	const stats = await memberTransactionRepository.getRevenue(filter)

	const revenueByHalls = stats.revenueByHalls.map(hall => ({
		hallId: hall.hallId,
		hallName: hall.name, // Название зала
		revenue: hall.totalRevenue || 0,
		sections: stats.revenueBySections
			.filter(section => section.hallId === hall.hallId)
			.map(section => ({
				sectionId: section.sectionId,
				sectionName: section.sectionName, // Название секции
				description: section.description, // Описание секции
				revenue: section.totalRevenue || 0,
				subscriptions: stats.revenueBySubscriptions
					.filter(
						sub =>
							sub.hallId === hall.hallId && sub.sectionId === section.sectionId
					)
					.map(subscription => ({
						subscriptionId: subscription.subscriptionId,
						subscriptionName: subscription.subscriptionName, // Название подписки
						numberOfSessions: subscription.numberOfSessions, // Количество сессий
						price: subscription.price, // Цена подписки
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
								firstName: member.firstName, // Имя
								lastName: member.lastName, // Фамилия
								age: member.age, // Возраст
								gender: member.gender, // Пол
								phone: member.phone,
								email: member.email,
								totalSpent: member.totalSpent || 0,
							})),
					})),
			})),
	}))

	return {
		totalRevenue: stats.totalRevenue,
		revenueByHalls,
	}
}

export default {
	getRevenue,
}
