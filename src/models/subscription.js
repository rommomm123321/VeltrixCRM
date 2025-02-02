import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const Subscription = sequelize.define(
	'Subscription',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		numberOfSessions: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
	},
	{
		tableName: 'Subscriptions',
		timestamps: true,
	}
)

export default Subscription
