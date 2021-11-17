module.exports = {
	name: 'chat',
	description: 'Chat with DialoGPT',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(
				'You must provide a message to chat with DialoGPT!'
			);
		}
		query(args.join(' ')).then((response) => {
			if (response.generated_text == '' || undefined) {
				return message.channel.send(
					'DialoGPT could not generate a response!'
				);
			} else {
				message.channel.send(response.generated_text);
			}
		});
	},
};
