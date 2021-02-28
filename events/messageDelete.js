const Discord = require('discord.js');
const MESSAGE_DELETED_TYPE = 72;
const ids = require('../ids.json');

async function onUserMessageDeleted(deletedMessage, client) {
    const messageDeletedLogs = await deletedMessage.guild.fetchAuditLogs({ type: MESSAGE_DELETED_TYPE });
    const messageDeletedLog = messageDeletedLogs.entries.first();
    if(deletedMessage.channel.id===ids.devsOnly) return;

    const logEmbed = new Discord.MessageEmbed()
        .setTitle("**MENSAGEM DELETADA**")
        .setColor("#fc3c3c")
        .addField("Autor", deletedMessage.author.tag, true)
        .addField("Canal", deletedMessage.channel, true)
        .addField("Mensagem", "```"+deletedMessage.content+"```")
        .setFooter(`Message ID: ${deletedMessage.id} | Author ID: ${deletedMessage.author.id}`);

    if (messageDeletedLog && messageDeletedLog.target.id == deletedMessage.author.id && +new Date - messageDeletedLog.createdTimestamp <= 10000) 
        logEmbed
            .addField("Deletada Pelo Staff:", messageDeletedLog.executor)
            .addField("Razão", messageDeletedLog.reason || "Unspecified")
            
            const logchannel = client.guilds.cache.get(ids.servidor).channels.cache.get(ids.modlogs);
            await logchannel.send(logEmbed);
}

module.exports = async (client, deletedMessage) => {
    if (!deletedMessage.author || deletedMessage.author.bot || deletedMessage.author.id === client.user.id) return;

    return onUserMessageDeleted(deletedMessage, client);
}