import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const Member = sequelize.define(
	'Member',
	{
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		age: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		gender: {
			type: DataTypes.ENUM('male', 'female', 'other'),
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: 'Members',
		timestamps: true,
	}
)

export default Member
