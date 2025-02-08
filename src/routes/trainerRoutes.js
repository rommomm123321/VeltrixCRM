import express from 'express'
import { trainerController } from '../controllers/index.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/trainers', authenticate, trainerController.getAllTrainersByUser)
router.post('/trainers', authenticate, trainerController.createTrainer)
router.put('/trainers/:id', authenticate, trainerController.updateTrainer)
router.delete('/trainers/:id', authenticate, trainerController.deleteTrainer)

export default router
