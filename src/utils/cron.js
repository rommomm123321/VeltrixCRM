import cron from 'node-cron'
import { MemberSubscriptions } from '../models/index.js'
import { Sequelize } from 'sequelize'

cron.schedule('0 2 * * *', async () => {
	console.log('Updating subscription statuses...')
	await MemberSubscriptions.update(
		{
			status: 'inactive',
		},
		{ where: { expirationDate: { [Sequelize.Op.lte]: new Date() } } }
	)
})

console.log('Cron job started for updating subscription statuses')
