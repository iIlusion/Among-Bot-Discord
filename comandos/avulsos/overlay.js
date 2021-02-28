const Discord = require('discord.js');
const ids = require('../../ids.json');
const ProfileController = require('../../controllers/profile-controller.js');

module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
		if (!args[1]) return message.reply("Uso: m!overlay <@user> <url>");
		let user;
		if (user = message.mentions.members.first()) {
			const profile = ProfileController.getProfileOfId(user.id);
			const badge = args.splice(1).join(",").trim();
			if (badge===`clear` || badge===`delete`)
				delete profile.badge;
			else
				profile.badge = badge;
			ProfileController.saveProfile(user.id, profile);

		} else return message.reply("Uso: m!overlay <@user> <url>");
	}
}

module.exports.set = async function(member, url) {
	await module.exports.run(
		null, 
		{ 
		  member: { hasPermission: () => true, },
		  reply: () => {},
		  mentions: { members: { first: () => member } }
		}, 
		['', ...url.split(' ')], null, null, null);
}

module.exports.config = {
    name: 'overlay',
	aliases: [],
	staff: true,
	changelog: "!"	
}