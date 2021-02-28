const Discord = require('discord.js');
const ids = require('../../ids.json');
const ProfileController = require('../../controllers/profile-controller.js');

module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
		if (!args[1]) return message.reply("Uso: m!setGold <@user> <qnt>");
		let user;
		if (user = message.mentions.members.first()) {
			const profile = ProfileController.getProfileOfId(user.id);
			const gold = args.splice(1).join(" ").trim();
            profile.gold = parseInt(gold);
			ProfileController.saveProfile(user.id, profile);

		} else return message.reply("Uso: m!setGold <@user> <qnt>");
	}
}

module.exports.config = {
    name: 'setGold',
	aliases: [],
	staff: true,
	changelog: '!'
}