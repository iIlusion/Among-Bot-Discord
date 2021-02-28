const fs = require('fs');
const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (/^\d+$/g.exec(args[0])) {
            const id = args[0];
            let multiplicador;
            if (args[1] && args[1].startsWith("+"))
                multiplicador = 1;
            else if (args[1] && args[1].startsWith("-"))
                multiplicador = -1;
            else
                return message.channel.send('Por favor, utilize `m!editban <id> +|-<tempo>`\nEx: `m!editban 26113794117 +3h2m1s` ou `m!editban 2611379411773 -20m50s`');
            const tempo = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/g.exec(args[1].substring(1));
            let banTimestamp;
            if (!id) return message.channel.send('Por favor, utilize m!editban <id> +|-<tempo>\nEx: m!editban 26113794117 +3h2m1s ou m!editban 2611379411773 -20m50s');
            if (!tempo) return message.channel.send('Por favor, utilize m!editban <id> +|-<tempo>\nEx: m!editban 26113794117 +3h2m1s ou m!editban 2611379411773 -20m50s');

            editBanTimestamp = parseInt(tempo[1] ? tempo[1] : 0) * 3600000 // h
                             + parseInt(tempo[2] ? tempo[2] : 0) * 60000   // m
                             + parseInt(tempo[3] ? tempo[3] : 0) * 1000;   // s

            let penalidades = require('../../penalidades.js');
            let p = await penalidades.get();
            p.bans[id]['expires-in'] = p.bans[id]['expires-in']+(editBanTimestamp*multiplicador);
            penalidades.set(p);
            message.channel.send(`:tada: | ${message.author} | **Ban do usuário alterado com sucesso!**`).then(msg => {
                msg.delete({timeout: 5000});
                message.react('✅');
            })

            const UserLog = require('../../classes/UserLog');
            const ulog = {};
            ulog[id] = {"eb": [+new Date(), message.member.user.id]};
            new UserLog(client, message.guild, false, ulog).cast();
        } else {
            return message.channel.send('Por favor, utilize `m!editban <id> +|-<tempo>`\nEx: `m!editban 26113794117 +3h2m1s` ou `m!editban 2611379411773 -20m50s`');
        }
    }
}

module.exports.config = {
    name: 'editban',
    aliases: ["editarban"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}