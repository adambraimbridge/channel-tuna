const querystring = require('querystring')
const { appController } = require('../lib/app-controller')

exports.handler = ({ httpMethod, body }) => {
	// @todo: set headers({ 'X-Slack-No-Retry': 1 }) // See: https://api.slack.com/events-api

	// Guardian: Only allow POST requests
	if (httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed' }
	}

	const { token, type, challenge, event_id, bot_id, text, response_url } = querystring.parse(body)
	console.debug(`Slack event: ${event_id}`)

	// Guardian: Slack verification token
	const { SLACK_VERIFICATION_TOKEN } = process.env
	if (!token || token !== SLACK_VERIFICATION_TOKEN) {
		return { statusCode: 401, body: 'Unauthorized' }
	}

	// Handle Slack challenges. See: https://api.slack.com/events/url_verification
	if (type === 'url_verification' && !!challenge) {
		return { statusCode: 200, body: challenge }
	}

	// Ignore empty messages
	if (!text || !text.trim().length > 0) {
		return { statusCode: 204, body: 'No Content' }
	}

	/**
	 * Hand over to the app controller
	 *
	 * Do not await a response, because otherwise it will time out,
	 * and Slack would keep resending the event.
	 */
	appController({ body })

	// Always respond with OK
	return { statusCode: 200 }
}