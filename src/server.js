import path from 'path'
import app from './app.js'
import express from 'express'
import './utils/queue.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 8000

app.use(express.static(path.join(__dirname, 'public/assets')))

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/assets', 'index.html'))
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
