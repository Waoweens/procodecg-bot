const { getFirestore, collection, addDoc } = require('firebase/firestore');
const db = getFirestore();
const { DateTime } = require('luxon');

module.exports = {
	name: 'addbirthday',
	description: 'birthday reminder',
	execute(message, args) {
		var userid = message.mentions.users.first().id;

		var birthday = DateTime.fromFormat(args.slice(1).join(' '), 'dd/MM/yyyy HH:mm')
			.setZone('Asia/Jakarta')

		if (!args.length) {
			return message.channel.send('Please mention a user and provide a birthday with format `@mention dd/MM/yyyy HH:mm`.');
		} else if (!birthday.isValid) {
			return message.channel.send('Invalid message format! Please use `@mention dd/MM/yyyy HH:mm`.');
		} else {addBirthday()}

		async function addBirthday() {
			try {
				var docRef = await addDoc(collection(db, 'birthdays'), {
					userid: userid,
					birthday: birthday.toString(),
				});
				message.channel.send('Successfully added your birthday! ' + docRef.id);
			} catch (err) {
				message.channel.send('An error has occured while trying to add your birthday:\n```'+err+'```');
			}
		}
	},
};
