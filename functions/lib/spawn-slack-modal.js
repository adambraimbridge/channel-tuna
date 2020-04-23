const { WebClient } = require('@slack/web-api')
const slackClient = new WebClient(process.env.BOT_USER_ACCESS_TOKEN)

const getModalJson = ({ trigger_id, callback_id }) => ({
	trigger_id,
	view: {
		callback_id,
		type: 'modal',
		title: {
			type: 'plain_text',
			text: 'Channel Tuna',
		},
		blocks: [
			{
				type: 'section',
				block_id: 'loading',
				text: {
					type: 'mrkdwn',
					text: '🍥 Loading ...',
				},
			},
		],
	},
})

const spawnSlackModal = async ({ trigger_id, callback_id }) => {
	const response = await slackClient.views //
		.open(getModalJson({ trigger_id, callback_id }))
		.catch(console.error)

	return response
}

module.exports = { spawnSlackModal }
