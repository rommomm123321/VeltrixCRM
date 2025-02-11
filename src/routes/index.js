import hallRoutes from './hallRoutes.js'
import authRoutes from './authRoutes.js'
import sectionRoutes from './sectionRoutes.js'
import subscriptionRoutes from './subscriptionRoutes.js'
import memberRoutes from './memberRoutes.js'
import statisticsRoutes from './statisticsRoutes.js'
import trainerRoutes from './trainerRoutes.js'
import expenseRoutes from './expenseRoutes.js'

import imageRoutes from './imageRoutes.js'

const routes = app => {
	app.use('/api/v1', hallRoutes)
	app.use('/api/v1', authRoutes)
	app.use('/api/v1', sectionRoutes)
	app.use('/api/v1', subscriptionRoutes)
	app.use('/api/v1', memberRoutes)
	app.use('/api/v1/', statisticsRoutes)
	app.use('/api/v1/', trainerRoutes)
	app.use('/api/v1/', expenseRoutes)
	// app.use('/api/v1', imageRoutes)
}

export default routes
