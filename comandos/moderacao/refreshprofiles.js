const Discord = require('discord.js');
const ProfileController = require('../../controllers/profile-controller.js');
const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        if (args[0] !== 'confirm') {
            message.reply('Tem certeza de que deseja resetar **todos** os níveis de **todos** os usuários do servidor?\n'
                        + 'Se sim, digite m!rp confirm');
            return;
        }
        const profiles = ProfileController.getProfiles();
        for (let p in profiles) {
            if (profiles[p].customAstro) delete profiles[p].customAstro;
            const oldLevel = Math.floor(Math.pow(profiles[p].xp, 10/32));
            profiles[p].color = '#C71110';
            profiles[p].items = [];
            profiles[p].gold = profiles[p].xp ? Math.floor(15*Math.pow(oldLevel, 1.5)) : 0;
            profiles[p].xp = 0;
        }
        ProfileController.saveProfiles(profiles);
        
        message.react('✅');
    } else
        message.reply("Você não tem permissão para atualizar as configurações do servidor.");
}
    
module.exports.config = {
    name: 'refreshprofiles',
    aliases: ["rp"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}