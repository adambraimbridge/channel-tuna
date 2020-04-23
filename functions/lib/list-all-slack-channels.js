const { WebClient } = require('@slack/web-api')
const slackClient = new WebClient(process.env.BOT_USER_ACCESS_TOKEN)

const getSlackChannels = async () => {
	const response = await slackClient.conversations //
		.list({
			types: 'public_channel',
			exclude_archived: true,
			limit: 1000,
		})
		.catch(console.error)
	return response
}

const getModalJson = ({ view_id, callback_id, channels }) => {
	const blocks = channels.map((channel) => {
		return [
			{
				type: 'section',
				block_id: 'slack-channel-list',
				text: {
					type: 'mrkdwn',
					text: `${channel.name_normalized} — ${channel.purpose.value}`,
				},
			},
		]
	})

	return {
		view_id,
		view: {
			callback_id,
			type: 'modal',
			title: {
				type: 'plain_text',
				text: `Channel Tuna: All Slack channels`,
			},
			blocks,
		},
	}
}

const listAllSlackChannels = async ({ view_id, callback_id }) => {
	const { channels } = await getSlackChannels()
	const response = await slackClient.views //
		.update(
			getModalJson({
				view_id,
				callback_id,
				channels,
			})
		)
		.catch(console.error)

	return response
}

module.exports = { listAllSlackChannels }
