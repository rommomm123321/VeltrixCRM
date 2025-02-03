import express from 'express'
import { authController } from '../controllers/index.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         verificationCode:
 *           type: string
 *           description: The verification code sent to the user's email.
 *         verificationCodeExpires:
 *           type: string
 *           format: date-time
 *           description: The expiration date and time of the verification code.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated.
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: API endpoints for user authentication.
 */

/**
 * @swagger
 * /api/v1/auth/request-code:
 *   post:
 *     summary: Request verification code
 *     description: Sends a verification code to the user's email.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email to which the verification code will be sent.
 *     responses:
 *       200:
 *         description: Verification code sent successfully.
 *       400:
 *         description: Invalid email format or other error.
 *       404:
 *         description: User not found.
 */

router.post('/auth/request-code', authController.requestCode)
/**
 * @swagger
 * /api/v1/auth/verify:
 *   post:
 *     summary: Verify user email
 *     description: Verifies the user's email with the verification code.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationCode
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email to verify.
 *               verificationCode:
 *                 type: string
 *                 description: The verification code to verify the email.
 *     responses:
 *       200:
 *         description: User verified successfully.
 *       400:
 *         description: Invalid verification code or other error.
 *       404:
 *         description: User not found.
 */

router.post('/auth/verify', authController.verify)

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get authenticated user
 *     description: Returns the authenticated user's information along with their halls and sections.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. No valid token provided.
 *       500:
 *         description: Internal server error.
 */

router.get('/me', authenticate, authController.me)

export default router
