const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (message.mentions.members.first()) {
            try {
                const UserLog = require('../../classes/UserLog');
                const ulog = {};
                ulog[message.mentions.members.first().id] = {"k": [+new Date(), message.member.user.id]};
                new UserLog(client, message.guild, false, ulog).cast();
                message.mentions.members.first().kick();
            } catch {
                message.reply("Eu não tenho permissão para kickar pessoas");
            }
        }
    } else
        message.reply("Você não tem permissão para tirar " + msg.mentions.members.first() + " do servidor.");
}
    
module.exports.config = {
    name: 'kick',
    aliases: ["kickar"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}