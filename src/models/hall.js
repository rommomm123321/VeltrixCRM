import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const Hall = sequelize.define(
	'Hall',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: 'Halls',
		timestamps: true,
		paranoid: true,
	}
)

export default Hall
