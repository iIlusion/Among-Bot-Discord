const Discord = require('discord.js');
const ids = require('../ids.json');

async function onUserMessageEdited(oldMessage, newMessage, client) {
    if(newMessage.channel.id===ids.devsOnly) return;
    const logEmbed = new Discord.MessageEmbed()
        .setTitle("**MENSAGEM EDITADA**")
        .setColor("#0000FF")
        .addField("Autor", oldMessage.author.tag, true)
        .addField("Canal", oldMessage.channel, true)
        .addField("Mensagem", "```"+oldMessage.content+"```")
        .addField("Mensagem Editada:", "```"+newMessage.content+"```")
        .setFooter(`Message ID: ${oldMessage.id} | Author ID: ${oldMessage.author.id}`);
        
        const logchannel = client.guilds.cache.get(ids.servidor).channels.cache.get(ids.modlogs);
        await logchannel.send(logEmbed);
}

module.exports = async (client, oldMessage, newMessage) => {
    if (!newMessage.author || newMessage.author.bot || newMessage.author.id === client.user.id) return;

    return onUserMessageEdited(oldMessage, newMessage, client);
}