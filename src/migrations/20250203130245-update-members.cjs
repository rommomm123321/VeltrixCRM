'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Members', 'phone', {
			type: Sequelize.STRING,
			allowNull: true,
		})

		await queryInterface.addColumn('Members', 'email', {
			type: Sequelize.STRING,
			allowNull: true,
			validate: {
				isEmail: true,
			},
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Members', 'phone')
		await queryInterface.removeColumn('Members', 'email')
	},
}
