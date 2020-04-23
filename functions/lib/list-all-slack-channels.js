const { WebClient } = require('@slack/web-api')
const slackClient = new WebClient(process.env.BOT_USER_ACCESS_TOKEN)

const getSlackChannels = async () => {
	const response = await slackClient.conversations //
		.list({
			token: process.env.BOT_USER_ACCESS_TOKEN,
			types: 'public_channel',
			exclude_archived: true,
			limit: 1000,
		})
		.catch(console.error)
	return response
}

const getModalJson = ({ view_id, callback_id, channels }) => {
	const fields = channels //
		.sort((a, b) => {
			return a.name_normalized.toUpperCase() < b.name_normalized.toUpperCase() ? -1 : 1
		})
		.reduce((accumulator, channel) => {
			const text = channel.purpose.value.length > 0 ? channel.purpose.value : 'No description here.'
			accumulator.push(
				{
					type: 'mrkdwn',
					text: `#${channel.name_normalized}`,
				},
				{
					type: 'mrkdwn',
					text: `${text}`,
				}
			)
			return accumulator
		}, [])

	return {
		view_id,
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
					block_id: 'slack-channel-list',
					text: {
						type: 'mrkdwn',
						text: 'All Slack channels',
					},
					fields,
				},
			],
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
