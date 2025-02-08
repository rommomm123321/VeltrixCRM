import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const Trainer = sequelize.define(
	'Trainer',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
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
		gender: {
			type: DataTypes.ENUM('male', 'female', 'other'),
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		dateOfBirth: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		tableName: 'Trainers',
		timestamps: true,
		paranoid: true,
	}
)

export default Trainer
