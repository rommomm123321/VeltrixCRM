import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const EmailQueue = sequelize.define(
	'EmailQueue',
	{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM('verification', 'welcome', 'notification'),
			defaultValue: 'verification',
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
			defaultValue: 'pending',
			allowNull: false,
		},
	},
	{
		tableName: 'email_queue',
		timestamps: true,
	}
)

export default EmailQueue
