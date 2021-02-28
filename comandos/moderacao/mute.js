const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (message.mentions.members.first()) {
            const member = message.mentions.members.first();
            const logsChannelId = ids.logs

            if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(':scream: | **Você não tem permissão para mutar esse usuário!**').then(msg => msg.delete({timeout: 5000}));

            const {id} = member;
            let penalidades = require('../../penalidades.js');
            if (args.length===1) {
                message.channel.send('uso: m!mute <@usuário> <tempo> [motivo]');
                return;
            }
            const tempo = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/g.exec(args[1]);
            if (!(tempo[1] || tempo[2] || tempo[3])) {
                message.channel.send('Formato incorreto! Exemplos: 2h, 5m30s, 10s, ...');
                return;
            } else if (!(tempo[1] || tempo[2]) && 5 > parseInt(tempo[3])) {
                message.channel.send('Erro! Valor minimo = 5s');
                return;
            }
            timestampAdd = parseInt(tempo[1] ? tempo[1] : 0) * 3600000 // h
                         + parseInt(tempo[2] ? tempo[2] : 0) * 60000   // m
                         + parseInt(tempo[3] ? tempo[3] : 0) * 1000;   // s

            const motivo = args.slice(2).length > 0 ? args.slice(2).join(' ').trim() : 'Descumprir as regras';

            let p = await penalidades.get();
            p.mutes[id] = +new Date+timestampAdd;
            await penalidades.set(p);

            let embedmute = new Discord.MessageEmbed()
      
            .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL({dynamic: true})}`)
            .setTitle(':no_entry_sign: | Úsuario Punido')
            .setColor('#C71110')
            .setDescription(`**${member.user.username} foi mutado por "${motivo}".**`)
            .addField('Tempo:',`${tempo[1] ? tempo[1] + ' hora(s)' : ''}${tempo[1] && (tempo[2] || tempo[3]) ? ', ' : ''}${tempo[2] ? tempo[2] + ' minuto(s)' : ''}${tempo[2] && tempo[3] ? ', ' : ''}${tempo[3] ? tempo[3] + ' segundo(s)' : ''}`,true)
            .addField('Pelo MOD:',`${message.member}`,true)
            .setImage('https://i.kym-cdn.com/photos/images/original/001/890/995/e1c.gif')
            .setTimestamp()
            .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');


            //let muteMessage = `${member} foi mutado pelo moderador ${message.member}`;

            //muteMessage += `\n**Tempo:** ${tempo[1] ? tempo[1] + ' hora(s)' : ''}${tempo[1] && (tempo[2] || tempo[3]) ? ', ' : ''}${tempo[2] ? tempo[2] + ' minuto(s)' : ''}${tempo[2] && tempo[3] ? ', ' : ''}${tempo[3] ? tempo[3] + ' segundo(s)' : ''}`
            
            const logsChannel = client.channels.cache.get(logsChannelId);
    
            if (!client.fromWarn && logsChannel)
                logsChannel.send(`||${member.toString()}||`, embedmute);

            message.channel.send(`:tada: | ${message.author} | **Usuário punido com sucesso!**`).then(msg => {
                msg.delete({timeout: 5000});
                message.react('✅')
            })

            const UserLog = require('../../classes/UserLog');
            const ulog = {};
            ulog[id] = {"m": [+new Date(), message.member.user.id]};
            new UserLog(client, message.guild, false, ulog).cast();

            member.roles.add(ids.mutado);
            member.roles.add(ids.seppunicao).catch(()=>{});

            if (member.voice.channel)
                member.voice.kick();
        } 
    } else
        message.reply("Você não tem permissão para usar o comando mute.");
}
    
module.exports.config = {
    name: 'mute',
    aliases: ["mutar"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}