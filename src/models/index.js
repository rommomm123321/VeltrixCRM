import User from './user.js'
import Hall from './hall.js'
import Section from './section.js'
import Member from './member.js'
import HallSection from './hallSection.js'
import Subscription from './subscription.js'
import SectionSubscription from './sectionSubscription.js'
import MemberSubscriptions from './memberSubscriptions.js'
import MemberTransaction from './memberTransaction.js'

User.hasMany(Hall, { foreignKey: 'userId' })
Hall.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Section, { foreignKey: 'userId' })
Section.belongsTo(User, { foreignKey: 'userId' })
Hall.belongsToMany(Section, {
	through: HallSection,
	foreignKey: 'hallId',
	otherKey: 'sectionId',
})
Section.belongsToMany(Hall, {
	through: HallSection,
	foreignKey: 'sectionId',
	otherKey: 'hallId',
})
User.hasMany(Subscription, { foreignKey: 'userId' })
Subscription.belongsTo(User, { foreignKey: 'userId' })
Section.belongsToMany(Subscription, {
	through: SectionSubscription,
	foreignKey: 'sectionId',
})
Subscription.belongsToMany(Section, {
	through: SectionSubscription,
	foreignKey: 'subscriptionId',
})
User.hasMany(Member, { foreignKey: 'userId' })
Member.belongsTo(User, { foreignKey: 'userId' })
Hall.hasMany(Member, { foreignKey: 'hallId' })
Member.belongsTo(Hall, { foreignKey: 'hallId' })

Member.belongsToMany(Section, {
	through: MemberSubscriptions,
	foreignKey: 'memberId',
})
Section.belongsToMany(Member, {
	through: MemberSubscriptions,
	foreignKey: 'sectionId',
})
MemberSubscriptions.belongsTo(Subscription, { foreignKey: 'subscriptionId' })
MemberSubscriptions.belongsTo(Hall, { foreignKey: 'hallId' })
MemberSubscriptions.belongsTo(Section, { foreignKey: 'sectionId' })
Subscription.hasMany(MemberSubscriptions, { foreignKey: 'subscriptionId' })
Section.hasMany(MemberSubscriptions, { foreignKey: 'sectionId' })
Hall.hasMany(MemberSubscriptions, { foreignKey: 'hallId' })
Member.hasMany(MemberSubscriptions, { foreignKey: 'memberId' })
Member.hasMany(MemberTransaction, { foreignKey: 'memberId' })
MemberTransaction.belongsTo(Member, { foreignKey: 'memberId' })
Hall.hasMany(MemberTransaction, { foreignKey: 'hallId' })
MemberTransaction.belongsTo(Hall, { foreignKey: 'hallId' })
Section.hasMany(MemberTransaction, { foreignKey: 'sectionId' })
MemberTransaction.belongsTo(Section, { foreignKey: 'sectionId' })
Subscription.hasMany(MemberTransaction, { foreignKey: 'subscriptionId' })
MemberTransaction.belongsTo(Subscription, { foreignKey: 'subscriptionId' })
User.hasMany(MemberTransaction, { foreignKey: 'userId' })
MemberTransaction.belongsTo(User, { foreignKey: 'userId' })

export {
	User,
	Hall,
	Section,
	HallSection,
	Subscription,
	SectionSubscription,
	Member,
	MemberSubscriptions,
	MemberTransaction,
}
