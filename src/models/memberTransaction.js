import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const MemberTransaction = sequelize.define(
	'MemberTransaction',
	{
		memberId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'Members', key: 'id' },
			onDelete: 'CASCADE',
		},
		hallId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'Halls', key: 'id' },
			onDelete: 'CASCADE',
		},
		sectionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'Sections', key: 'id' },
			onDelete: 'CASCADE',
		},
		subscriptionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'Subscriptions', key: 'id' },
			onDelete: 'CASCADE',
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'Users', key: 'id' },
			onDelete: 'CASCADE',
		},
		amount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		transactionDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: 'MemberTransactions',
		timestamps: true,
	}
)

export default MemberTransaction
