import app from './app.js'
import './utils/queue.js'

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
