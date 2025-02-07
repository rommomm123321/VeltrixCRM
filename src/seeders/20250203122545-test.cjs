'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const users = await queryInterface.bulkInsert(
			'Users',
			[
				{
					email: 'admin@admin.com',
					verificationCode: '795f982b',
					verificationCodeExpires: new Date(
						new Date().setHours(new Date().getHours() + 1)
					),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{ returning: true }
		)
		const userId = users[0].id

		const halls = []
		for (let i = 1; i <= 100; i++) {
			halls.push({
				name: `Gym ${i}`,
				userId,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}
		const insertedHalls = await queryInterface.bulkInsert('Halls', halls, {
			returning: true,
		})

		const sections = []
		for (let i = 1; i <= 100; i++) {
			sections.push({
				name: `Section ${i}`,
				description: `Description for section ${i}`,
				userId,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}
		const insertedSections = await queryInterface.bulkInsert(
			'Sections',
			sections,
			{ returning: true }
		)

		const hallSections = []
		for (let i = 0; i < 100; i++) {
			hallSections.push({
				hallId: insertedHalls[i % 100].id,
				sectionId: insertedSections[i % 100].id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}
		await queryInterface.bulkInsert('HallSections', hallSections)

		// Создание подписок
		const subscriptions = []
		for (let i = 1; i <= 100; i++) {
			subscriptions.push({
				name: `Subscription ${i}`,
				numberOfSessions: 10 + (i % 10),
				price: 50 + (i % 50),
				userId,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}
		const insertedSubscriptions = await queryInterface.bulkInsert(
			'Subscriptions',
			subscriptions,
			{ returning: true }
		)

		const sectionSubscriptions = []
		for (let i = 0; i < 100; i++) {
			sectionSubscriptions.push({
				sectionId: insertedSections[i % 100].id,
				subscriptionId: insertedSubscriptions[i % 100].id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}
		await queryInterface.bulkInsert(
			'SectionSubscriptions',
			sectionSubscriptions
		)

		const members = []
		for (let i = 1; i <= 100; i++) {
			members.push({
				firstName: `FirstName ${i}`,
				lastName: `LastName ${i}`,
				age: 20 + (i % 40),
				gender: i % 2 === 0 ? 'male' : 'female',
				phone: `38000000000${i}`,
				email: `member${i}@example.com`,
				userId,
				hallId: insertedHalls[i % 100].id, // Link to the hall
				registrationDate: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}
		const insertedMembers = await queryInterface.bulkInsert(
			'Members',
			members,
			{ returning: true }
		)

		const memberSubscriptions = []
		for (let i = 0; i < 100; i++) {
			memberSubscriptions.push({
				memberId: insertedMembers[i % 100].id,
				hallId: insertedHalls[i % 100].id,
				sectionId: insertedSections[i % 100].id,
				subscriptionId: insertedSubscriptions[i % 100].id,
				priceAtPurchase: 50 + (i % 50),
				purchaseDate: new Date(),
				expirationDate: new Date(
					new Date().setMonth(new Date().getMonth() + 1)
				),
				usedSessions: 0,
				totalSessions: 10 + (i % 10),
				status: 'active',
				lastVisitDate: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}
		await queryInterface.bulkInsert('MemberSubscriptions', memberSubscriptions)

		const memberTransactions = []
		for (let i = 0; i < 100; i++) {
			memberTransactions.push({
				memberId: insertedMembers[i % 100].id,
				hallId: insertedHalls[i % 100].id,
				sectionId: insertedSections[i % 100].id,
				subscriptionId: insertedSubscriptions[i % 100].id,
				userId,
				amount: 50 + (i % 50),
				transactionDate: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}
		await queryInterface.bulkInsert('MemberTransactions', memberTransactions)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('MemberTransactions', null, {})
		await queryInterface.bulkDelete('MemberSubscriptions', null, {})
		await queryInterface.bulkDelete('Members', null, {})
		await queryInterface.bulkDelete('SectionSubscriptions', null, {})
		await queryInterface.bulkDelete('Subscriptions', null, {})
		await queryInterface.bulkDelete('HallSections', null, {})
		await queryInterface.bulkDelete('Sections', null, {})
		await queryInterface.bulkDelete('Halls', null, {})
		await queryInterface.bulkDelete('Users', null, {})
	},
}
