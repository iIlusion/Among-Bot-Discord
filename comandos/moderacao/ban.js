const fs = require('fs');
const ids = require('../../ids.json');


module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (!message.member.hasPermission("BAN_MEMBERS")) return;

    const logsChannelId = ids.logs;

    const userToBan = message.mentions.members.first();

    if (!userToBan) return message.channel.send(`Por favor, utilize m!ban <@membro> <tempo> <razão> | E.g. m!ban @Membro 1h30m10s Hacking`);

    if (message.author.id == userToBan.id) return message.channel.send(':no_entry_sign: | **Você não pode banir a si mesmo!**').then(msg => msg.delete({timeout: 5000}));

    if (message.member.roles.highest.position <= userToBan.roles.highest.position) return message.channel.send(':scream: | **Você não tem permissão para banir esse usuário!**').then(msg => msg.delete({timeout: 5000}));

    let banMessage = `${userToBan} foi banido pelo moderador ${message.author}`;
    let temp = ''

    let banTimestamp;

    if (args[1] && args[1].trim().toLowerCase() == 'permanente') {
        try {
            await userToBan.ban();
        } catch (err) {
            message.channel.send(':scream: | **Eu não possuo permissão para banir esse usuário!**').then(msg => {msg.delete({timeout: 5000}); message.delete({timeout: 5000})});
            return;
        }

        temp = 'Permanente'
        //banMessage += `\n**Tempo:** permanente`;
    } else {
        const banTime = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/g.exec(args[1]);
    
        if (!banTime[1] && !banTime[2] && !banTime[3]) banTime[1] = 3;
    
        banTimestamp = parseInt(banTime[1] ? banTime[1] : 0) * 3600000 // h
                             + parseInt(banTime[2] ? banTime[2] : 0) * 60000   // m
                             + parseInt(banTime[3] ? banTime[3] : 0) * 1000;   // s
    
        banTimestamp += +new Date();

        try {
            const UserLog = require('../../classes/UserLog');
            const ulog = {};
            ulog[userToBan.id] = {"b": [+new Date(), message.member.user.id]};
            new UserLog(client, message.guild, false, ulog).cast();

            setTimeout(()=>{userToBan.ban()}, 2000);
        } catch (err) {
            message.channel.send(':scream: | **Eu não possuo permissão para banir esse usuário!**').then(msg => {msg.delete({timeout: 5000}); message.delete({timeout: 5000})});
            return;
        }
        temp = `** ${banTime[1] ? banTime[1] + ' hora(s)' : ''}${banTime[1] && (banTime[2] || banTime[3]) ? ', ' : ''}${banTime[2] ? banTime[2] + ' minuto(s)' : ''}${banTime[2] && banTime[3] ? ', ' : ''}${banTime[3] ? banTime[3] + ' segundo(s)' : ''}**`
        //banMessage += `\n**Tempo:** ${banTime[1] ? banTime[1] + ' hora(s)' : ''}${banTime[1] && (banTime[2] || banTime[3]) ? ', ' : ''}${banTime[2] ? banTime[2] + ' minuto(s)' : ''}${banTime[2] && banTime[3] ? ', ' : ''}${banTime[3] ? banTime[3] + ' segundo(s)' : ''}`;
    }

    const banReason = args.slice(2).length > 0 ? args.slice(2).join(' ').trim() : 'Descumpriu as regras';

    const penalidades = JSON.parse(fs.readFileSync(process.cwd()+'/penalidades.json'));

    penalidades.bans[userToBan.id] = {
        'banned-by': message.author.id,
        'reason': banReason,
        'expires-in': banTimestamp || 'never',
        'banned-in': message.guild.id
    }

    fs.writeFileSync(process.cwd()+'/penalidades.json', JSON.stringify(penalidades));

    let embedban = new Discord.MessageEmbed()
      
      .setAuthor(`${userToBan.user.tag}`, `${userToBan.user.displayAvatarURL({dynamic: true})}`)
      .setTitle(':no_entry_sign: | Úsuario Punido')
      .setColor('#C71110')
      .setDescription('**'+userToBan.user.username+' foi banido por descumprir as regras.**')
      .addField('Tempo:',`${temp}`,true)
      .addField('Pelo MOD:',`<@${message.author.id}>`, true)
      .addField('Motivo:',`${banReason}`)
      .setImage('https://media1.tenor.com/images/ef4993b593954811a0c0a1c98af698a3/tenor.gif?itemid=16399941')
      .setTimestamp()
      .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');

    const logsChannel = client.channels.cache.get(logsChannelId);
    
    if (!client.fromWarn && logsChannel) logsChannel.send(`||${userToBan.toString()}||`, embedban);

    message.channel.send(`:tada: | ${message.author} | **Usuário punido com sucesso!**`).then(msg => {
        msg.delete({timeout: 5000});
        message.react('✅')
    })
}

module.exports.config = {
    name: 'ban',
    aliases: ["banir"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}