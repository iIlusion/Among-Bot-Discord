const ids = require('../../ids.json');

let warnEmoji;
let muteEmoji;
let banpEmoji;
let banEmoji;
let ignoreEmoji;
let enviou = false
let idmsg;
let membro;


module.exports.run = async function (client, message, args, config, Discord) {
    warnEmoji = client.emojis.cache.get(ids.warnEmojiId);
    muteEmoji = client.emojis.cache.get(ids.muteEmojiId);
    banpEmoji = client.emojis.cache.get(ids.banpEmojiId);
    banEmoji = client.emojis.cache.get(ids.confirmarEmojiId);
    ignoreEmoji = client.emojis.cache.get(ids.negarEmojiId);

    const logchannel = client.guilds.cache.get(ids.servidor).channels.cache.get(ids.reportlog);
    const votechannel = client.guilds.cache.get(ids.servidor).channels.cache.get(ids.reportvote);
    

    message.delete({timeout:500})
    const matches = /([^ ]+) +(nave ?\d+|nenhuma?) +(.*)/i.exec(args.join(' ').trim());
    if (!matches) return message.channel.send("Formato: m!report @usuario <sala> <motivo>").then(msg => msg.delete({timeout:5000}))
    let toReport = message.mentions.members.first();
    toReport = toReport ? toReport : (/^[0-9<>@!]+$/.test(matches[0]) ? matches[0] : undefined);
    const sala = matches[2];
    const reportTexto = matches[3];
    

    if (!reportTexto || !toReport) return message.channel.send(':no_entry_sign: ** | Para fazer o report utilize o comando `m!report <usuário> <motivo>`\nex: m!report @Hacker Matou todos instantaneamente.**').then(msg => msg.delete({timeout:10000}));
    


    let embedReport = new Discord.MessageEmbed()
    .setAuthor(`💡 | Report de: ${message.author.username} (ID:${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)
    .setTitle(`Vote reagindo para decidir a punição!`)
    .addFields({ name: 'Usuário Reportado', value: `${toReport}${toReport.id ? `(ID: ${toReport.id})` : ''}` })
    .addFields({ name: 'Sala:', value:`${sala}`})
    .setDescription("\n**Report:**\n```"+reportTexto+"```\n"
        //+ `${warnEmoji} - Warn\n`
        //+ `${muteEmoji} - Mute\n`
        //+ `${banpEmoji} - Banir de Partidas\n`
        //+ `${banEmoji} - Banir\n`
        //+ `${ignoreEmoji} - Ignorar\n
        )
    .setColor("#ff5555")
    .setTimestamp()
    .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');

    message.channel.send(`:white_check_mark: **| Usuário reportado**`).then(msg => msg.delete({timeout:3000}))
    logchannel.send(embedReport);
    votechannel.send(`<@&${ids.moderador}>`, embedReport).then(msg => {
        //msg.react(warnEmoji);
        //msg.react(muteEmoji);
       // msg.react(banpEmoji);
        //msg.react(banEmoji);
        //msg.react(ignoreEmoji);
        msg.react('✅');
        
        collectReaction(embedReport, msg, reportTexto, client, Discord);
    })


}


function collectReaction(reportEmbed, msg, reportTexto, client, Discord) {
    const filter = (reaction, user) => !user.bot;

    const collector = msg.createReactionCollector(filter, { });

    collector.on('collect', (reaction, user) => {
        const reportchannel = client.guilds.cache.get(ids.servidor).channels.cache.get(ids.reportmod);
        membro = msg.guild.members.cache.get(user.id)

        let warn = msg.reactions.cache.get(warnEmoji.id);
        let mute = msg.reactions.cache.get(muteEmoji.id);
        let banp = msg.reactions.cache.get(banpEmoji.id);
        let ban = msg.reactions.cache.get(banEmoji.id);
        let ignore = msg.reactions.cache.get(ignoreEmoji.id)

        //let decisionText = "Votaram Warn:";
        //warn.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        //decisionText += "\nVotaram Mute:";
        //mute.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        //decisionText += "\nVotaram Banir Partida:";
        //banp.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        //decisionText += "\nVotaram Ban:";
        //ban.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        //decisionText += "\nVotaram para não punir:";
        //ignore.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});

        reportEmbed.setDescription("\n**Report:**\n```"+reportTexto+"```\n");
        
        if (reaction.emoji.name=='✅' && membro.roles.cache.some(role => role.id === ids.moderador)){
            collector.stop();
            return
        } else {
            return
        }
            
    });

    collector.on('end', (reaction, user) => {
        let warn = msg.reactions.cache.get(warnEmoji.id);
        let mute = msg.reactions.cache.get(muteEmoji.id);
        let banp = msg.reactions.cache.get(banpEmoji.id);
        let ban = msg.reactions.cache.get(banEmoji.id);
        let ignore = msg.reactions.cache.get(ignoreEmoji.id);

        const reportchannel = client.guilds.cache.get(ids.servidor).channels.cache.get(ids.reportmod);

        //let decisionText = "Votaram Warn:";
        //warn.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        //decisionText += "\nVotaram Mute:";
        //mute.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        //decisionText += "\nVotaram Banir Partida:";
        //banp.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        //decisionText += "\nVotaram Ban:";
        //ban.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        //decisionText += "\nVotaram para não punir:";
        //ignore.users.cache.forEach(u=>{ if (!u.bot) decisionText+=`\n • ${u}`});
        msg.delete();
        
        reportEmbed.setDescription("\n**Report:**\n```"+reportTexto+"```\n");
        reportEmbed.addFields({ name: 'Finalizado pelo mod:', value:`<@${membro.id}>`})
        reportchannel.send(reportEmbed).then(msg => msg.react('✅'));
    });
}

module.exports.config = {
    name: 'report',
    aliases: ['reportar'],
    canal: ids.reportar,
    staff: false,
    changelog: "!"
}