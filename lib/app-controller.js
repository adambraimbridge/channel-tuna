const axios = require('axios')

const appController = async ({ body }) => {
	const { text } = body
	try {
		await axios.post(
			response_url,
			{
				response_type: 'in_channel',
				text,
			},
			{
				headers: { 'content-type': 'application/json' },
			}
		)
		return {
			statusCode: 200,
		}
	} catch (error) {
		console.error(error)
		return {
			statusCode: 422, // Unprocessable Entity
			body: error.message,
		}
	}
}

module.exports = { appController }
