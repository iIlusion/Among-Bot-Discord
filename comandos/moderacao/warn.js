const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord, ids) {
    const logsChannelId = ids.logs
    if (message.member.hasPermission("BAN_MEMBERS")) {
        if (message.mentions.members.first()) {
            const member = message.mentions.members.first();

            if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(':scream: | **Você não tem permissão para avisar esse usuário!**').then(msg => msg.delete({timeout: 5000}));

            const {id} = member;
            let penalidades = require('../../penalidades.js');
            
            let p = await penalidades.get();
            p.avisos[id] = p.avisos[id] ? p.avisos[id] + 1 : 1;
            await penalidades.set(p); // ()
            
            //let warnMessage = `${member} recebeu um warn do moderador ${message.member}`;
            //warnMessage += `\n${member} você foi avisado ${p.avisos[id]} vez(es).`;
            let punicao = "Nenhuma"
            let motivo = "Descumpriu as regras"

            if (args[1]) {
                motivo = args;
                motivo = motivo.splice(1).join(" ");
            }
            
            if (p.avisos[id]===2 || p.avisos[id]===3)
                //warnMessage += ` (Tempo de mute: ${p.avisos[id]===2 ? '30m' : '3h'})`;
                punicao = `Mute de: ${p.avisos[id]===2 ? '30m' : '3h'}`
            else if (p.avisos[id]>3)
                //warnMessage += ` (Tempo de ban: ${p.avisos[id]-3}h)`;
                punicao = `Ban de: ${p.avisos[id]-3}h`
            
            const logsChannel = client.channels.cache.get(logsChannelId);
    
            let embedwarn = new Discord.MessageEmbed()
      
            .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL({dynamic: true})}`)
            .setTitle(':no_entry_sign: | Úsuario Avisado')
            .setColor('#C71110')
            .setDescription(`**${member.user.username} (${member}) recebeu um aviso por "${motivo}".**`)
            .addField('Avisos totais:',`${p.avisos[id]}`,true)
            .addField('Pelo MOD:',`${message.member}`,true)
            .addField('Punição:', `${punicao}`)
            .setImage('https://media1.tenor.com/images/ef4993b593954811a0c0a1c98af698a3/tenor.gif?itemid=16399941')
            .setTimestamp()
            .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');

            if (logsChannel)
                logsChannel.send(`||${member.toString()}||`, embedwarn);

            message.react('✅')

            const UserLog = require('../../classes/UserLog');
            const ulog = {};
            ulog[id] = {"w": [+new Date(), message.member.user.id]};
            new UserLog(client, message.guild, false, ulog).cast();
            
            const role = message.channel.guild.roles.cache.find(role => role.id === ids.mutado);
            client.fromWarn = true;
            setTimeout(()=>{client.fromWarn = false}, 1000);
            if (p.avisos[id] === 2) { // Mute de 30s
                message.channel.send('Tempo de mute: 30m').then(msg => {msg.delete({timeout: 5000})});

                const {run} = require('./mute.js');
                run(client, message, [`${args[0]}`, `30m`], config, Discord, ids);

            } else if (p.avisos[id] === 3) { // Mute de 3h
                message.channel.send('Tempo de mute: 3h').then(msg => {msg.delete({timeout:5000})})
                
                const {run} = require('./mute.js');
                run(client, message, [`${args[0]}`, `3h`], config, Discord, ids);

            } else if (p.avisos[id] >= 4) { // Ban (escalonar Hora por Aviso)
                const tempoban = p.avisos[id]-3;
                message.channel.send('Tempo de ban: '+tempoban+'h').then(msg => {msg.delete({timeout:5000})})

                const {run} = require('./ban.js');
                run(client, message, [`${args[0]}`, `${tempoban}h`, `O usuário foi avisado ${p.avisos[id]}x.`], config, Discord, ids);
            }
        } else
            message.reply("Formato incorreto! Use: m!warn <@usuário> [motivo]");
    } else
        message.reply("Você não tem permissão para usar o comando warn.");
}
    
module.exports.config = {
    name: 'warn',
    aliases: ["avisar"],
    canal: ids.comandos,
    staff: true,
    changelog: "!"
}