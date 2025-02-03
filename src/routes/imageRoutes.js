import express from 'express'
import multer from 'multer'
import { imageController } from '../controllers/index.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         fieldname:
 *           type: string
 *           description: The field name of the file input
 *         originalname:
 *           type: string
 *           description: The original name of the uploaded file
 *         encoding:
 *           type: string
 *           description: The encoding type of the file
 *         mimetype:
 *           type: string
 *           description: The MIME type of the file
 *         buffer:
 *           type: string
 *           format: byte
 *           description: The file's binary data
 *         size:
 *           type: integer
 *           description: The size of the file in bytes
 *   requestBodies:
 *     FileUpload:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *   responses:
 *     UploadSuccess:
 *       description: The image was uploaded successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Success message
 *               file:
 *                 $ref: '#/components/schemas/File'
 *     UploadError:
 *       description: Failed to upload image
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 description: Error message
 * /api/v1/images/upload:
 *   post:
 *     summary: Upload an image
 *     description: Uploads an image to the server.
 *     tags:
 *       - Image
 *     requestBody:
 *       $ref: '#/components/requestBodies/FileUpload'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UploadSuccess'
 *       400:
 *         $ref: '#/components/responses/UploadError'
 */
router.post('/images/upload', upload.single('image'), imageController.upload)

export default router
