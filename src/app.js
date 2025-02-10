import express from 'express'
import { sequelize } from './config/index.js'
import routes from './routes/index.js'
import swaggerSetup from './swagger/swagger.js'
import errorHandler from './middlewares/errorHandler.js'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())

swaggerSetup(app)

routes(app)

app.use(errorHandler)

sequelize
	.sync({ force: false })
	.then(() => console.log('✅ Database synced'))
	.catch(err => console.error('❌ Database sync error:', err))

export default app
