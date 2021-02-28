const ids = require('../../ids.json');
const Global = require('../../classes/Global');

module.exports.run = async function (client, message, args, config, Discord) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        if (!/^\d+ \d+( \d+ \d+)?$/.test(args.join(' ')))
            return message.reply("Formato incorreto! Use: `m!cargoOficial <idCargo> <idEmoji>` **ou** `m!cargoOficial <idCargo> <idEmoji> <idCanal> <idMsg>`")
                .then(msg=>message.delete({timeout: 10000})&msg.delete({timeout: 10000}));
        
        let cargo = args[0];
        let emoji = args[1];
        let canal = args[2];
        let msgId = args[3];

        if (!msgId)
            message.channel.createMessageCollector(m => m.author.id === message.author.id, {
                max: 1,
                time: 120000
            }).on('collect', collected => {
                msg = collected;
                msg.react(client.emojis.cache.get(emoji));
                controller = require('../../JSON/controller.js');
                let json = controller.get('cargos');
                json.push({channelId: msg.channel.id, msgId: msg.id, cargo, emoji});
                controller.set('cargos', json)
            })
        else {
            let cacheChannel = message.guild.channels.cache.get(canal); 
            if(cacheChannel){
                cacheChannel.messages.fetch(msgId)
                .then(msg => {
                    msg.react(client.emojis.cache.get(emoji));
                    controller = require('../../JSON/controller.js');
                    let json = controller.get('cargos');
                    json.push({channelId: msg.channel.id, msgId: msg.id, cargo, emoji});
                    controller.set('cargos', json)
                })
                .catch(()=>message.reply('Mensagem não encontrada!'));
            } else {message.reply('Canal não encontrado!')}
        }
        message.react('✅');
    } else
        message.reply("Você não tem permissão para usar este comando.");
}
    
module.exports.config = {
    name: 'cargoOficial',
    aliases: [],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}