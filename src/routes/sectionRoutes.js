import express from 'express'
import { sectionController } from '../controllers/index.js'
import { isOwner } from '../middlewares/ownerMiddleware.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { Section } from '../models/index.js'

const router = express.Router()

router.get('/sections', authenticate, sectionController.getAllSectionsByUser)
router.get(
	'/sections/:id',
	authenticate,
	isOwner(Section),
	sectionController.getSectionById
)
router.post('/sections', authenticate, sectionController.createSection)
router.put(
	'/sections/:id',
	authenticate,
	isOwner(Section),
	sectionController.updateSection
)
router.delete(
	'/sections/:id',
	authenticate,
	isOwner(Section),
	sectionController.deleteSection
)
router.delete('/sections', authenticate, sectionController.deleteSection)

export default router
