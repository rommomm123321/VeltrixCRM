import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const SectionSubscription = sequelize.define(
	'SectionSubscription',
	{
		sectionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Sections',
				key: 'id',
			},
		},
		subscriptionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Subscriptions',
				key: 'id',
			},
		},
	},
	{
		tableName: 'SectionSubscriptions',
		timestamps: true,
	}
)

export default SectionSubscription
