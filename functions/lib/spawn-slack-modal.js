const { WebClient } = require('@slack/web-api')
const web = new WebClient(process.env.SLACK_AUTHENTICATION_TOKEN)

const json = {
	view: {
		type: 'modal',
		callback_id: 'modal-identifier',
		title: {
			type: 'plain_text',
			text: 'Just a modal',
		},
		blocks: [
			{
				type: 'section',
				block_id: 'section-identifier',
				text: {
					type: 'mrkdwn',
					text: '*Welcome* to ~my~ Block Kit _modal_!',
				},
				accessory: {
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'Just a button',
					},
					action_id: 'button-identifier',
				},
			},
		],
	},
}

const spawnSlackModal = async ({ trigger_id, callback_id }) => {
	json.trigger_id = trigger_id
	const response = await web.views.open(json).catch(console.error)
	console.log({ ...response })
	return response
}

module.exports = { spawnSlackModal }
