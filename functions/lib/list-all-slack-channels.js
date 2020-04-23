const axios = require('axios')

/**
 * @param { payload } — A payload of Slack event data
 */
const appController = async ({ payload }) => {
	console.log('appController')

	const { type, trigger_id, callback_id } = payload
	if (!!type && !!trigger_id && !!callback_id) {
		await handleCallback({ payload })
	}
}

module.exports = { appController }
