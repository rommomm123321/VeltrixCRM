'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('MemberTransactions', 'amount', {
			type: Sequelize.DECIMAL(10, 2),
			allowNull: false,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('MemberTransactions', 'amount', {
			type: Sequelize.STRING,
			allowNull: false,
		})
	},
}
