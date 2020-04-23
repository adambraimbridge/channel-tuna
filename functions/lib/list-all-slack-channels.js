const { WebClient } = require('@slack/web-api')
const slackClient = new WebClient(process.env.BOT_USER_ACCESS_TOKEN)

const getModalJson = ({ view_id, callback_id }) => ({
	view_id,
	view: {
		callback_id,
		type: 'modal',
		title: {
			type: 'plain_text',
			text: `All Slack channels`,
		},
		blocks: [
			{
				type: 'section',
				block_id: 'slack-channel-list',
				text: {
					type: 'mrkdwn',
					text: `Here's a list all Slack channels`,
				},
			},
		],
	},
})

const listAllSlackChannels = async ({ view_id, callback_id }) => {
	const response = await slackClient.views //
		.update(getModalJson({ view_id, callback_id }))
		.catch(console.error)

	return response
}

module.exports = { listAllSlackChannels }
