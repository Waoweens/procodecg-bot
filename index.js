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
	prefix,
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

client.on('messageCreate', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (err) {
		console.error(err);
		message.reply('An error occured while trying to tun this command.\n\n' + err);
	}
});

client.login(token);
