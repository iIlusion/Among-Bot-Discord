const ids = require('../../ids.json');

module.exports.pick = async function (client, channelId, msgId) {
    channel = client.channels.cache.get(channelId);
    channel.messages.fetch(msgId)
        .then(async message => {
            if (!message.reactions.cache.get(ids.negarEmojiId)) return;
            const confirmarEmoji = client.emojis.cache.get(ids.confirmarEmojiId);
            const negarEmoji = client.emojis.cache.get(ids.negarEmojiId);
            let positivo = message.reactions.cache.get(ids.confirmarEmojiId);
            let negativo = message.reactions.cache.get(ids.negarEmojiId); 
            positivo = positivo ? positivo.count - 1 : 0;
            negativo = negativo ? negativo.count - 1: 0;
            
            embed = message.embeds[0];
            embed.setDescription(embed.description+'\n\nResultados:\n' +
                `${confirmarEmoji}: ${positivo}\n` +
                `${negarEmoji}: ${negativo}`
            );
            embed.setTitle(positivo>negativo ? `${confirmarEmoji} Aprovada` : `${negarEmoji} Reprovada`);
            embed.setColor(positivo>negativo ? "50fa7b" : "ff5555");
            message.edit(embed);
            message.reactions.removeAll();

            const toSend = client.channels.cache.get(positivo>negativo ? ids.sugestaoAprovada : ids.sugestaoReprovada);
            if (toSend) toSend.send(embed);
        })
        .catch(console.error);
}

module.exports.run = async function (client, message, args, config, Discord) {
    const tempoSugestao = 24*60*60000; // 24h

    message.delete({timeout:500})
    const sugestaoTexto = args.length > 0 ? args.join(' ').trim() : undefined;

    if (!sugestaoTexto) return message.channel.send(':no_entry_sign: ** | Para fazer uma sugestão utilize o comando `m!sugerir <sugestão>`\nex: m!sugerir Adicionar novos bots para interação.**').then(msg => msg.delete({timeout:10000}));
    if (sugestaoTexto.length <25) return message.channel.send (':no_entry_sign: ** | Sua sugestão não pode ter menos de 25 caracteres, desenvolva ela melhor. **').then(msg => msg.delete({timeout:10000}))


    let embedSugestao = new Discord.MessageEmbed()
    .setAuthor(`💡 | Sugestão de: ${message.author.username} (ID:${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)
    .setTitle(`Vote reagindo para decidir se a sugestão merece ser aprovada ou não!`)
    .setDescription("\n**Sugestão:**\n```"+sugestaoTexto+"```\n**Caso queira fazer uma sugestão utilize o comando `m!sugerir <sugestão>`\nex: m!sugerir Adicionar mais bots de entretinemento.**")
    .setColor("#FFFF00")
    .setTimestamp()
    .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');

    message.channel.send(embedSugestao).then(msg => {
        msg.react(client.emojis.cache.get(ids.confirmarEmojiId))
        msg.react(client.emojis.cache.get(ids.negarEmojiId))
        
        controller = require('../../JSON/controller.js');
        let json = controller.get('sugestoes');
        json.push({channelId: msg.channel.id, msgId: msg.id, timestamp: +new Date()+tempoSugestao});
        controller.set('sugestoes', json)
    })
}

    module.exports.config = {
        name: 'sugerir',
        aliases: ["sugestao"],
        canal: ids.sugestao,
        staff: false,
        changelog: "!"
    }