const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (message.mentions.members.first()) {
            const member = message.mentions.members.first();
            const {id} = member;
            let penalidades = require('../../penalidades.js');
            let p = await penalidades.get();
            delete p.banidop[id];
            await penalidades.set(p);

            member.roles.remove(ids.banidop);
            if (!member.roles.cache.has(ids.mutado))
                member.roles.remove(ids.seppunicao).catch(()=>{});

            message.channel.send(`:tada: | ${message.author} | **Usuário desbanido de partidas com sucesso!**`).then(msg => {
                msg.delete({timeout: 5000});
                message.react('✅');
            })
            
            const UserLog = require('../../classes/UserLog');
            const ulog = {};
            ulog[id] = {"ubp": [+new Date(), message.member.user.id]};
            new UserLog(client, message.guild, false, ulog).cast();
        } else {
            message.reply('Uso: m!unbanp <@usuário>');
        }
    }
}

module.exports.config = {
    name: 'unbanp',
    aliases: ["desbanirp", "unbanirp"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}