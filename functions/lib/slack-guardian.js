const slackGuardian = ({ httpMethod, payload }) => {
	console.log({ ...payload })

	const { token, type, challenge, event_id } = payload

	console.debug(`Slack event: ${event_id}`)

	// @todo: set headers({  }) // See: https://api.slack.com/events-api

	// Guardian: Only allow POST requests
	if (httpMethod !== 'POST') {
		return {
			isValid: false,
			statusCode: 405,
			body: 'Method Not Allowed',
			headers: {
				'X-Slack-No-Retry': 1,
			},
		}
	}

	// Guardian: Slack verification token
	const { SLACK_VERIFICATION_TOKEN } = process.env
	if (!token || token !== SLACK_VERIFICATION_TOKEN) {
		return {
			isValid: false,
			statusCode: 401,
			body: 'Unauthorized',
			headers: {
				'X-Slack-No-Retry': 1,
			},
		}
	}

	// Handle Slack challenges. See: https://api.slack.com/events/url_verification
	if (type === 'url_verification' && !!challenge) {
		return {
			isValid: true,
			statusCode: 200,
			body: challenge,
			headers: {},
		}
	}

	return {
		isValid: true,
	}
}

module.exports = { slackGuardian }