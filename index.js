const fs = require('fs');
const { DateTime } = require('luxon');
const schedule = require('node-schedule');
const { token, prefix } = require('./config.json');

const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_WEBHOOKS,
	],
});

const firebaseConfig = {
	apiKey: 'AIzaSyDJFySLD_YxdEBDGt3Prb7SqvjfkNFEETw',
	authDomain: 'procodecg-bot.firebaseapp.com',
	projectId: 'procodecg-bot',
	storageBucket: 'procodecg-bot.appspot.com',
	messagingSenderId: '917652846171',
	appId: '1:917652846171:web:5697d2fceda71d37d7717e',
	measurementId: 'G-TDEDHM65W4',
};
const { initializeApp } = require('firebase/app');
const app = initializeApp(firebaseConfig);
const {
	getFirestore,
	collection,
	query,
	onSnapshot,
} = require('firebase/firestore');
const db = getFirestore();

client.commands = new Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	client.user.setActivity('your messages', { type: 'WATCHING' });
	console.log('Ready!');

	async function getBirthdays() {
		const q = query(collection(db, 'birthdays'));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				try {
					var bdUserId = change.doc.data().userid;
					var bdChannelId = change.doc.data().channelid;
					var bdGuildId = change.doc.data().guildid;
					var bdReminder = DateTime.fromISO(change.doc.data().birthday);
					var bdRule = new schedule.RecurrenceRule();

					bdRule.tz = 'Asia/Jakarta';
					bdRule.date = bdReminder.day;
					bdRule.month = bdReminder.month - 1;
					bdRule.hour = bdReminder.hour;
					bdRule.minute = bdReminder.minute;
					// bdRule.second = [...Array(60).keys()];

					const bdJob = schedule.scheduleJob(bdRule, () => {
						client.channels
							.fetch(bdChannelId)
							.then((channel) => {
								channel.send(
									`<@${bdUserId}> Happy birthday! :tada:`
								);
							})
							.catch((err) => {
								console.log(err);
							});
					});

				} catch (error) {
					console.log(error);
				}
			});
		});
	}
	getBirthdays();
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
		message.reply(
			'An error occured while trying to tun this command:\n```' +
				err +
				'```'
		);
	}
});

client.login(token);
