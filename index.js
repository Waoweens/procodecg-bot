const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { Client, Intents, MessageEmbed } = require('discord.js');
const { prefix, token, dialogpt_token } = require('./config.json');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.GUILD_WEBHOOKS],
});

client.once('ready', () => {
	console.log('Ready!');
});

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
					pad_token_id: 50256
				},
			}),
		}
	);

	const result = await response.json();
	return result;
}

client.on('messageCreate', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	const text = args.join(' ');

	if (command == 'help') {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor('#fb8c00')
					.setTitle('PCG Bot')
					.setDescription('List of commands')
					.addField('!!help', 'Shows this message')
					.addField('!!ping', 'Check roundtrip latency')
					.addField('!!chat', 'Chat with DialoGPT')
					.setTimestamp()
					.setFooter(
						'the prank collection',
					),
			],
		});
	}

	if (command == 'ping') {
		message.channel.send('Pinging...').then((sent) => {
			sent.edit(
				`Roundtrip latency: ${
					sent.createdTimestamp - message.createdTimestamp
				}ms`
			);
		});
	}

	if (command == 'chat') {
		if (!args.length) {
			return message.channel.send(
				'You must provide a message to chat with DialoGPT!'
			);
		}

		try {
			query(text).then((response) => {

				if (response.generated_text == '' || undefined) {
					return message.channel.send(
						'DialoGPT could not generate a response!'
					);
				} else { message.channel.send(response.generated_text); }
			});
		} catch (err) {
			message.channel.send(
				'An error occured while trying to tun this command.\n\n' + err
			);
			console.log(err);
		}
	}
});

client.login(token);