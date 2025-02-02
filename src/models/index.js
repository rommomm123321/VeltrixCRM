import User from './user.js'
import Hall from './hall.js'
import Section from './section.js'
import Member from './member.js'
import HallSection from './hallSection.js'
import Subscription from './subscription.js'
import SectionSubscription from './sectionSubscription.js'
import MemberSubscriptions from './memberSubscriptions.js'

User.hasMany(Hall, { foreignKey: 'userId' })
Hall.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Section, { foreignKey: 'userId' })
Section.belongsTo(User, { foreignKey: 'userId' })

Hall.belongsToMany(Section, { through: HallSection, foreignKey: 'hallId' })
Section.belongsToMany(Hall, { through: HallSection, foreignKey: 'sectionId' })

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

export {
	User,
	Hall,
	Section,
	HallSection,
	Subscription,
	SectionSubscription,
	Member,
	MemberSubscriptions,
}
