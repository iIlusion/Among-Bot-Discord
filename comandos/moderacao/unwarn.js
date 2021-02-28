const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord, ids) {
    const logsChannelId = ids.logs
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (message.mentions.members.first()) {
            const member = message.mentions.members.first();

            if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(':scream: | **Você não tem permissão para desavisar esse usuário!**').then(msg => msg.delete({timeout: 5000}));

            const {id} = member;
            let penalidades = require('../../penalidades.js');
            
            let p = await penalidades.get();
            if (p.avisos[id]) {
                p.avisos[id] = p.avisos[id] - 1;
                if (!p.avisos[id])
                    delete p.avisos[id];
                await penalidades.set(p);
                message.channel.send(`:tada: | ${message.author} | **Usuário desavisado com sucesso!**`).then(msg => {
                    msg.delete({timeout: 5000});
                    message.react('✅')
                })
                
                const UserLog = require('../../classes/UserLog');
                const ulog = {};
                ulog[id] = {"uw": [+new Date(), message.member.user.id]};
                new UserLog(client, message.guild, false, ulog).cast();
            } else {
                message.channel.send(`:scream: | **Este usuário não tem avisos para serem retirados!**`).then(msg => {
                    msg.delete({timeout: 5000});
                    message.react('❌')
                })
            }
        } else
            message.reply("Formato incorreto! Use: m!unwarn <@usuário>");
    } else
        message.reply("Você não tem permissão para usar o comando unwarn.");
}
    
module.exports.config = {
    name: 'unwarn',
    aliases: ["desavisar"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}