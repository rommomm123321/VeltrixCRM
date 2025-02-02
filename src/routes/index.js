import hallRoutes from './hallRoutes.js'
import authRoutes from './authRoutes.js'
import imageRoutes from './imageRoutes.js'
import sectionRoutes from './sectionRoutes.js'
import subscriptionRoutes from './subscriptionRoutes.js'
import memberRoutes from './memberRoutes.js'

const routes = app => {
	app.use('/api/v1', hallRoutes)
	app.use('/api/v1/images', imageRoutes)
	app.use('/api/v1/auth', authRoutes)
	app.use('/api/v1', sectionRoutes)
	app.use('/api/v1', subscriptionRoutes)
	app.use('/api/v1', memberRoutes)
}

export default routes
