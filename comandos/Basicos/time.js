const ids = require('../../ids.json');

function pad(num){
    num = ""+num;
    var pad = "00";
    return pad.substring(0, pad.length - num.length) + num;
}

function dhm(ms){
    days = Math.floor(ms / (24*60*60*1000));
    daysms=ms % (24*60*60*1000);
    hours = Math.floor((daysms)/(60*60*1000));
    hoursms=ms % (60*60*1000);
    minutes = Math.floor((hoursms)/(60*1000));
    minutesms=ms % (60*1000);
    sec = Math.floor((minutesms)/(1000));
    return (days>0?days+"d ":"")+pad(hours)+":"+pad(minutes)+":"+pad(sec) + 
           (ms < 0 ? ' (aguardando entrar p/ remover punição)' : '');
}

module.exports.run = async function (client, message, args, config, Discord) {
        let id = message.mentions.members.first();
        if (id) id = id.id;
        if (!id && /^\d+$/.test(args[0]))
            id = args[0];
        else if (!id) 
            return message.reply("Usuário não encontrado! Use: m!time <id/@usuario>")

        let user = true;
        try {
            await client.guilds.cache.get(ids.servidor).members.fetch(id);
        } catch (userNotFound) {
            user = false;
        }

        //const user = .members.cache.get(id);
        userFound = user ? '' : ' (usuário não está no servidor)';
        penalties = "";
        let penalidades = require('../../penalidades.js');
        let p = await penalidades.get();
        now = +new Date();
        if (p.mutes[id] && p.mutes[id]-now>0)
            penalties+=`Mute: ${dhm(p.mutes[id]-now)}\n`;
        if (p.bans[id])
            penalties+=`Ban: ${dhm(p.bans[id]['expires-in']-now)}\n`;
        if (p.banidop[id])
            penalties+=`Ban Partidas: ${dhm(p.banidop[id]-now)}\n`;
        if (p.avisos[id])
            penalties+=`Avisos: ${p.avisos[id]}\n`;
        if (!penalties)
            penalties="Este usuário não está penalizado!";
        message.channel.send(`Penalidades de <@${id}>${userFound}:\n\`\`\`${penalties}\`\`\``);
    }
    
    
    module.exports.config = {
        name: 'time',
        aliases: ["penalidades"],
        canal: ids.comandos,
        staff: false,
        changelog: "!"
    }