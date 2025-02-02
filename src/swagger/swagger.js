import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'CRM Hall Management API',
			version: '1.0.0',
			description: 'CRM Hall Management API',
			url: 'https://github.com/rommomm123321/VeltrixCRM',
		},
		servers: [
			{
				url: 'http://localhost:8000',
			},
		],
	},
	apis: [`./src/routes/*.js`],
}
const specs = swaggerJsDoc(options)
export default app => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}
