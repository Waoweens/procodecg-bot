const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { dialogpt_token } = require('./../config.json');

module.exports = {
	name: 'chat',
	description: 'Chat with DialoGPT',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(
				'You must provide a message to chat with DialoGPT!'
			);
		}

		async function query(payload) {
			var response = await fetch(
				'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
				{
					headers: { Authorization: `Bearer ${dialogpt_token}` },
					method: 'POST',
					body: JSON.stringify({
						inputs: { text: payload },
						parameter: {
							top_p: 0.9,
							temperature: 1.2,
							pad_token_id: 50256,
						},
					}),
				}
			);

			const result = await response.json();
			return result;
		}

		query(args.join(' ')).then((response) => {
			if (response.generated_text == '' || undefined) {
				message.channel.send('DialoGPT could not generate a response!');
			} else {
				try {
					message.channel.send(response.generated_text);
				} catch (err) {
					console.log(err);
					message.channel.send(
						'DialoGPT could not generate a response!'
					);
				}
			}
		});
	},
};
