import express from 'express'
import { subscriptionController } from '../controllers/index.js'
import { isOwner } from '../middlewares/ownerMiddleware.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { Subscription } from '../models/index.js'

const router = express.Router()

router.get(
	'/subscriptions',
	authenticate,
	subscriptionController.getAllSubscriptionsByUser
)
router.get(
	'/subscriptions/:id',
	authenticate,
	isOwner(Subscription),
	subscriptionController.getSubscriptionById
)
router.post(
	'/subscriptions',
	authenticate,
	subscriptionController.createSubscription
)
router.put(
	'/subscriptions/:id',
	authenticate,
	isOwner(Subscription),
	subscriptionController.updateSubscription
)
router.delete(
	'/subscriptions/:id',
	authenticate,
	isOwner(Subscription),
	subscriptionController.deleteSubscription
)
router.delete(
	'/subscriptions',
	authenticate,
	subscriptionController.deleteSubscription
)
router.post(
	'/track-visit',
	authenticate,
	subscriptionController.trackVisitController
)
router.post(
	'/renew-subscription',
	authenticate,
	subscriptionController.renewSubscription
)

export default router
