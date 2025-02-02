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
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: 'Sections',
		timestamps: true,
	}
)

export default Section
