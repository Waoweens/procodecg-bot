module.exports = {
	name: 'ping',
	description: 'Shows API roundrip latency',
	execute(message, args) {
		message.channel.send('Pinging...').then((sent) => {
			sent.edit(
				`Roundtrip latency: ${
					sent.createdTimestamp - message.createdTimestamp
				}ms`
			);
		});
	},
};
