import cron from 'node-cron'
import { MemberSubscriptions } from '../models/index.js'
import { Sequelize } from 'sequelize'

cron.schedule('0 2 * * *', async () => {
	console.log('Updating subscription statuses...')

	const now = new Date()
	const endOfToday = new Date(now)
	endOfToday.setHours(23, 50, 0, 0)

	await MemberSubscriptions.update(
		{
			status: 'inactive',
		},
		{ where: { expirationDate: { [Sequelize.Op.lte]: endOfToday } } }
	)
})

console.log('Cron job started for updating subscription statuses')
