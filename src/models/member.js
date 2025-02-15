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
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
		registrationDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			unique: true,
		},
	},
	{
		paranoid: true,
		tableName: 'Members',
		timestamps: true,
		deletedAt: 'deletedAt',
	}
)

export default Member
