import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const Hall = sequelize.define(
	'Hall',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: 'Halls',
		timestamps: true,
	}
)

export default Hall
