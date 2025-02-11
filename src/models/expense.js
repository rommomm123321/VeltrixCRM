import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const Expense = sequelize.define(
	'Expense',
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		amount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		tableName: 'Expenses',
		timestamps: true,
	}
)

export default Expense
