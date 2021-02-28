const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (message.mentions.members.first()) {
            const member = message.mentions.members.first();
            const logsChannelId = ids.logs

            if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(':scream: | **Você não tem permissão para banir esse usúario de partidas!**').then(msg => msg.delete({timeout: 5000}));

            const {id} = member;
            let penalidades = require('../../penalidades.js');
            if (args.length===1) {
                message.channel.send('uso: m!banirp <@membro> <tempo> [motivo]');
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

            let motivo = "Atrapalhando as partidas"

            if (args[2]) {
                motivo = args;
                motivo = motivo.splice(2).join(" ");
            }

            let p = await penalidades.get();
            p.banidop[id] = +new Date+timestampAdd;
            await penalidades.set(p);

            let embedbanirp = new Discord.MessageEmbed()
      
            .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL({dynamic: true})}`)
            .setTitle(':no_entry_sign: | Úsuario Punido')
            .setColor('#C71110')
            .setDescription(`**${member.user.username} foi banido das partidas por "${motivo}".**`)
            .addField('Tempo:',`${tempo[1] ? tempo[1] + ' hora(s)' : ''}${tempo[1] && (tempo[2] || tempo[3]) ? ', ' : ''}${tempo[2] ? tempo[2] + ' minuto(s)' : ''}${tempo[2] && tempo[3] ? ', ' : ''}${tempo[3] ? tempo[3] + ' segundo(s)' : ''}`,true)
            .addField('Pelo MOD:',`${message.member}`,true)
            .setImage('https://i.kym-cdn.com/photos/images/original/001/890/995/e1c.gif')
            .setTimestamp()
            .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');


            //let muteMessage = `${member} foi mutado pelo moderador ${message.member}`;

            //muteMessage += `\n**Tempo:** ${tempo[1] ? tempo[1] + ' hora(s)' : ''}${tempo[1] && (tempo[2] || tempo[3]) ? ', ' : ''}${tempo[2] ? tempo[2] + ' minuto(s)' : ''}${tempo[2] && tempo[3] ? ', ' : ''}${tempo[3] ? tempo[3] + ' segundo(s)' : ''}`
            
            const logsChannel = client.channels.cache.get(logsChannelId);
    
            if (!client.fromWarn && logsChannel)
                logsChannel.send(`||${member.toString()}||`, embedbanirp);

            message.channel.send(`:tada: | ${message.author} | **Usuário punido com sucesso!**`).then(msg => {
                msg.delete({timeout: 5000});
                message.react('✅')
            })

            const UserLog = require('../../classes/UserLog');
            const ulog = {};
            ulog[id] = {"bp": [+new Date(), message.member.user.id]};
            new UserLog(client, message.guild, false, ulog).cast();

            member.roles.add(ids.banidop);
            member.roles.add(ids.seppunicao).catch(()=>{});            

            if (member.voice)
                member.voice.kick();
        } else
            message.channel.send('uso: m!banirp <@membro> <tempo> [motivo]');
    } else
        message.reply("Você não tem permissão para usar o comando de banir de partidas.");
}
    
module.exports.config = {
    name: 'banirp',
    aliases: ["banirpartida", "banp"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}