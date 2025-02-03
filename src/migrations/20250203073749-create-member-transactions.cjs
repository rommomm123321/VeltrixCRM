'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('MemberTransactions', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			memberId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'Members', key: 'id' },
				onDelete: 'CASCADE',
			},
			hallId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'Halls', key: 'id' },
				onDelete: 'CASCADE',
			},
			sectionId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'Sections', key: 'id' },
				onDelete: 'CASCADE',
			},
			subscriptionId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'Subscriptions', key: 'id' },
				onDelete: 'CASCADE',
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			amount: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			transactionDate: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('MemberTransactions')
	},
}
