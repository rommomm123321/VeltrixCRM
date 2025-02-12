'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('MemberSubscriptions', {
			memberId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Members',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			hallId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Halls',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			sectionId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Sections',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			subscriptionId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Subscriptions',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			priceAtPurchase: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			purchaseDate: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			expirationDate: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			usedSessions: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			totalSessions: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM('active', 'inactive'),
				allowNull: false,
				defaultValue: 'active',
			},
			lastVisitDate: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			visitHistory: {
				type: Sequelize.JSON,
				allowNull: true,
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
		await queryInterface.dropTable('MemberSubscriptions')
	},
}
