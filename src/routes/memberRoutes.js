import express from 'express'
import { memberController } from '../controllers/index.js'
import { isOwner } from '../middlewares/ownerMiddleware.js'
import { Member } from '../models/index.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/members', authenticate, memberController.createMember)
router.get('/members', authenticate, memberController.getAllMembersByUser)
router.get(
	'/members/:id',
	authenticate,
	isOwner(Member),
	memberController.getMemberById
)
router.put(
	'/members/:id',
	authenticate,
	isOwner(Member),
	memberController.updateMember
)

router.delete(
	'/members/:id',
	authenticate,
	isOwner(Member),
	memberController.deleteMember
)
router.delete('/members', authenticate, memberController.deleteMember)

export default router
