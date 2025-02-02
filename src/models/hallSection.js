import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const HallSection = sequelize.define(
	'HallSection',
	{
		hallId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Halls',
				key: 'id',
			},
		},
		sectionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Sections',
				key: 'id',
			},
		},
	},
	{
		tableName: 'HallSections',
		timestamps: true,
	}
)

export default HallSection
