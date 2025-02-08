import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const Section = sequelize.define(
	'Section',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: 'Sections',
		timestamps: true,
		paranoid: true,
	}
)

export default Section
