const { getFirestore, collection, addDoc } = require('firebase/firestore');
const db = getFirestore();
const { DateTime } = require('luxon');

module.exports = {
	name: 'addbirthday',
	description: 'birthday reminder',
	execute(message, args) {
		var userid = message.mentions.users.first().id;
		var channelid = message.channel.id;
		var guildid = message.guild.id;

		var birthday = DateTime.fromFormat(
			args.slice(1).join(' '),
			'dd/MM HH:mm'
		).setZone('Asia/Jakarta');

		if (!args.length || message.mentions.users.size === 0) {
			return message.channel.send(
				'Please mention a user and provide a birthday with format `@mention dd/MM HH:mm`.'
			);
		} else if (
			DateTime.fromFormat(
				args.slice(1).join(' '),
				'dd/MM/yyyy HH:mm'
			).setZone('Asia/Jakarta').isValid
		) {
			return message.channel.send(
				'Birthdays happens once every year. Please remove the year from your reminder. Use format `@mention dd/MM HH:mm`.'
			);
		} else if (
			DateTime.fromFormat(args.slice(1).join(' '), 'dd/MM HH:mm').setZone(
				'Asia/Jakarta'
			).isValid
		) {
			addBirthday();
		} else {
			return message.channel.send(
				'Invalid Arguments! Provide a mention and birthday with format `@mention dd/MM HH:mm`.'
			);
		}

		async function addBirthday() {
			try {
				var docRef = await addDoc(collection(db, 'birthdays'), {
					userid: userid,
					channelid: channelid,
					guildid: guildid,
					birthday: birthday.toString(),
				});
				message.channel.send(
					'Successfully added your birthday! ' + docRef.id
				);
			} catch (err) {
				message.channel.send(
					'An error has occured while trying to add your birthday:\n```' +
						err +
						'```'
				);
			}
		}
	},
};
