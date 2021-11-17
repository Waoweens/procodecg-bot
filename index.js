const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const {
	Client,
	Intents,
	MessageEmbed,
	Collection,
	Permissions,
	Guild,
} = require('discord.js');
const {
	token,
	dialogpt_token,
	prefix,
	ownerID
} = require('./config.json');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_WEBHOOKS,
	],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	client.user.setActivity('your messages', { type: 'WATCHING' });
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
					pad_token_id: 50256,
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

	if (command == 'dev') message.channel.send('["develop" branch](https://github.com/Waoweens/procodecg-bot/tree/develop) of PCG bot. Experiments are tested here');

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (err) {
		console.error(err);
		message.reply('An error occured while trying to tun this command.\n\n' + err);
	}
});

client.login(token);
