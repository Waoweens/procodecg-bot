const { getFirestore, collection, addDoc } = require('firebase/firestore');
const db = getFirestore();
const { DateTime } = require('luxon');

module.exports = {
	name: 'addbirthday',
	description: 'birthday reminder',
	execute(message, args) {
		var userid = message.author.id;
		var birthday = DateTime.fromFormat(args.join(' '), 'dd/MM/yyyy HH:mm')
			.setZone('Asia/Jakarta')

		if (!args.length) {
			return message.channel.send('Please provide a birthday with format `dd/MM/yyyy HH:mm`.');
		} else if (!birthday.isValid) {
			return message.channel.send('Invalid Date/Time Format! Please use `dd/MM/yyyy HH:mm`.');
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
