const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (message.mentions.members.first()) {
            const member = message.mentions.members.first();
            const {id} = member;
            let penalidades = require('../../penalidades.js');
            let p = await penalidades.get();
            delete p.mutes[id];
            await penalidades.set(p);

            member.roles.remove(ids.mutado);
            if (!member.roles.cache.has(ids.banidop))
                member.roles.remove(ids.seppunicao).catch(()=>{});

            message.channel.send(`:tada: | ${message.author} | **Usuário desmutado com sucesso!**`).then(msg => {
                msg.delete({timeout: 5000});
                message.react('✅')
            })
            
            const UserLog = require('../../classes/UserLog');
            const ulog = {};
            ulog[id] = {"um": [+new Date(), message.member.user.id]};
            new UserLog(client, message.guild, false, ulog).cast();
        } else {
            message.reply('Uso: m!unmute <@usuário>');
        }
    }
}

module.exports.config = {
    name: 'unmute',
    aliases: ["desmutar"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}