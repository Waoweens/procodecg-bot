const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Shows the help menu',
	execute(message, args) {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor('#fb8c00')
					.setTitle('PCG Bot')
					.setDescription('List of commands')
					.addField('!!help', 'Shows this message')
					.addField('!!ping', 'Check roundtrip latency')
					.addField('!!chat', 'Chat with DialoGPT')
					.addField('!!birthday', 'Set your birthday')
					.setTimestamp()
					.setFooter('I am a bot, and this action was performed automatically'),
			],
		});
	},
};
