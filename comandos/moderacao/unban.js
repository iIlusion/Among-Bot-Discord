const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (/^\d+$/g.exec(args[0])) {
            const id = args[0];
            let penalidades = require('../../penalidades.js');
            let p = await penalidades.get();
            delete p.bans[id];
            await penalidades.set(p);
            try {
                await message.guild.members.unban(id);
                message.channel.send(`:tada: | ${message.author} | **Usuário desbanido com sucesso!**`).then(msg => {
                    msg.delete({timeout: 5000});
                    message.react('✅');
                });
                const UserLog = require('../../classes/UserLog');
                const ulog = {};
                ulog[id] = {"ub": [+new Date(), message.member.user.id]};
                new UserLog(client, message.guild, false, ulog).cast();
            } catch (err) {
                message.channel.send(':scream: | **Este usuário não está banido!**').then(msg => {msg.delete({timeout: 5000}); message.delete({timeout: 5000})});
                return;
            }
        } else {
            message.reply('Uso: m!unban <id>')
        }
    }
}

module.exports.config = {
    name: 'unban',
    aliases: ["desbanir"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}