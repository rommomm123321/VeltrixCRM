import { DataTypes } from 'sequelize'
import { sequelize } from '../config/index.js'

const MemberSubscriptions = sequelize.define(
	'MemberSubscriptions',
	{
		memberId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Members',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		hallId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Halls',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		sectionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Sections',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		subscriptionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Subscriptions',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		priceAtPurchase: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		purchaseDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		expirationDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		usedSessions: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		totalSessions: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM('active', 'inactive'),
			allowNull: false,
			defaultValue: 'active',
		},
		lastVisitDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: 'MemberSubscriptions',
		timestamps: true,
	}
)

export default MemberSubscriptions
