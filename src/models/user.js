import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		verificationCode: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		verificationCodeExpires: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: 'Users',
		timestamps: true,
	}
)

export default User
