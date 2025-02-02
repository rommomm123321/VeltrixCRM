'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('SectionSubscriptions', {
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
		await queryInterface.dropTable('SectionSubscriptions')
	},
}
