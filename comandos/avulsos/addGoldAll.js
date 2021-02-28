const Discord = require('discord.js');
const ids = require('../../ids.json');
const ProfileController = require('../../controllers/profile-controller.js');

module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        if (!args[0]) return message.reply("Uso: m!addGoldAll <qnt>");

        const profiles = ProfileController.getProfiles();
        for (let id in profiles) 
            profiles[id].gold += parseInt(args[0]);
		
		ProfileController.saveProfiles(profiles);
	}
}

module.exports.config = {
    name: 'addGoldAll',
	aliases: [],
	staff: true,
	changelog: '!'
}