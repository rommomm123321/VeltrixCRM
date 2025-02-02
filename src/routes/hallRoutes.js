import express from 'express'
import { hallController } from '../controllers/index.js'
import { isOwner } from '../middlewares/ownerMiddleware.js'
import { Hall } from '../models/index.js'
import { authenticate } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.post('/halls', authenticate, hallController.createHall)
router.get('/halls', authenticate, hallController.getAllHallsByUser)
router.get(
	'/halls/:id',
	authenticate,
	isOwner(Hall),
	hallController.getHallById
)
router.put('/halls/:id', authenticate, isOwner(Hall), hallController.updateHall)

router.delete(
	'/halls/:id',
	authenticate,
	isOwner(Hall),
	hallController.deleteHall
)

export default router
