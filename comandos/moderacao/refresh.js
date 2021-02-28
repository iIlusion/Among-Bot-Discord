const Discord = require('discord.js');
const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (!args[0]) return message.reply("Use com refresh: `mutados`, `igns`");
    const type = args[0];
    if (message.member.hasPermission("ADMINISTRATOR")) {
        if (type==="mutados") {
		    const role = message.channel.guild.roles.cache.find(role => role.id === ids.mutado);
            message.channel.guild.channels.cache.forEach(c=>{ // iterar entre os canais
                c.updateOverwrite(role, {'SEND_MESSAGES': false, 'SPEAK': false});
            });
            message.react('✅');
        } else if (type==="igns"){
            const profiles = ProfileController.getProfiles();
            for (let p in profiles) {
                delete profiles[p].level;
                profiles[p].nick = "";
            }
            message.react('✅');
            ProfileController.saveProfiles(profiles);
        } else if (type==="banidosp") {
            const role = message.channel.guild.roles.cache.find(role => role.id === ids.banidop)
            let category = message.guild.channels.cache.filter(c => c.parentID === ids.partidanormal && c.type == "voice")
            //console.log(category)
            let channels = category.sort().filter(c => {
                c.updateOverwrite(role, {'CONNECT': false});
        });
        message.react('✅');
        }
		
        
    } else
        message.reply("Você não tem permissão para atualizar as configurações do servidor.");
}
    
module.exports.config = {
    name: 'refresh',
    aliases: ["refresh"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}