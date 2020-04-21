const querystring = require('querystring')

const slackGuardian = (request) => {
	const { httpMethod, body } = request
	// const payload = querystring.parse(body)

	let payload = {}
	try {
		payload = querystring.parse(body)
	} catch (error) {
		console.error(error.message)
	}

	console.log({ payload })

	const { token, type, challenge, event_id } = payload

	console.debug(`Slack event ID: ${event_id}`)

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
		...payload,
	}
}

module.exports = { slackGuardian }
