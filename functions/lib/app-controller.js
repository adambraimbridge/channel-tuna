const { spawnSlackModal } = require('./spawn-slack-modal')
const { listAllSlackChannels } = require('./list-all-slack-channels')

const handleCallback = async ({ type, trigger_id, callback_id }) => {
	// Happy path.
	// @todo Abstract this to handle dynamic callback IDs.
	if (callback_id === 'list-all-slack-channels') {
		const response = await spawnSlackModal({ trigger_id, callback_id }).catch(console.error)
	}
}

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
