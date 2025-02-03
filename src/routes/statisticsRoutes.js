import express from 'express'
import { statisticsController } from '../controllers/index.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/revenue', authenticate, statisticsController.getRevenue)

export default router
