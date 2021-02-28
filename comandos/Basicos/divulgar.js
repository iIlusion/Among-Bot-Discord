const ids = require('../../ids.json');

module.exports.divulgar = function (client, Discord, codigo, regiao, voiceChannel, oficial = false, mapa = undefined) {
    voiceChannel.fetchInvites().then(invites => {
        let code;
        invites.forEach(i=> {
            if (i.maxUses===0 && i.maxAge===0)
                code = i.code;
        });
        const vagas = 10 - voiceChannel.members.size;
        const fields = [
            {name: 'Código', value: codigo, inline: true},
            {name: 'Região', value: regiao, inline: true}
        ];
        if (mapa) fields.push({name: 'Mapa', value: mapa, inline: true});
        let embedSala = new Discord.MessageEmbed()
            .setTitle(`${oficial ? client.emojis.cache.get(ids.confirmarEmojiId):''} ${voiceChannel.name} está convidando!`)
            .setDescription(`\nCaso queira **divulgar sua partida** digite: \n\`m!divulgar [código] <NA/EU/ASIA> [SKELD/MIRA/POLUS]\`\n\n${vagas} vagas disponíveis [\`Entrar ⬅️\`](https://discord.gg/${code})`)
            .setColor(oficial ? "#ffb86c" : "#404040")
            .setTimestamp()
            .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png')
            .addFields(fields);
        if (oficial)
            client.channels.cache.get(ids.procurandoOficial).send('<@&'+ids.participanteOficial+'>', embedSala).then(msg=>msg.delete({timeout: 120*1000}));
        else
            client.channels.cache.get(ids.procurandoSala).send(embedSala).then(msg=>msg.delete({timeout: 120*1000}));
        voiceChannel.divulgado = +new Date();
    }).catch(err=>console.error);
}

module.exports.run = async function (client, message, args, config, Discord) {
    message.delete();
    const NAOTEM = 'Disponível após entrar';
    const filtroAProvaDeUsuario = /[<>\[\]]/g;

    rList = {"na": "North America", "eu": "Europe", "asia": "Asia"};
    mList = {"skeld": "The Skeld", "theskeld": "The Skeld", "mira": "Mira HQ", "mirahq": "Mira HQ", "polus": "Polus"};

    c = undefined;
    r = undefined;
    m = undefined;

    for (let arg of args) {
        arg = arg.toLowerCase().replace(filtroAProvaDeUsuario, '');
        if (rList[arg]) r = rList[arg]
        else if (mList[arg]) m = mList[arg]
        else c = arg;
    }

    if (!args) return message.reply("Formato Incorreto! Use: m!divulgar [código] <NA/EU/ASIA> [SKELD/MIRA/POLUS]").then(msg=>msg.delete({timeout: 10000}));
    else if (!r) return message.reply("Região inválida! Utilize apenas NA, EU, ou ASIA").then(msg=>msg.delete({timeout: 5000}));

    c = c ? (c === 'naotem' ? NAOTEM : c.toUpperCase()) : NAOTEM;

    const cName = message.member.voice.channel ? message.member.voice.channel.name.toLowerCase() : null;
    if (!cName || !(cName.includes("minigame") || cName.includes("nave")))
        return message.reply("Você precisa estar em um canal de partida para utilizar esse comando!").then(msg=>msg.delete({timeout: 5000}));
    if (+new Date()-message.member.voice.channel.divulgado < 120000) // 2 min
        return message.reply("Este canal já foi divulgado recentemente, aguarde um pouco.").then(msg=>msg.delete({timeout: 5000}));
    if (c!==NAOTEM && c.length!=6)
        return message.reply("Código de partida inválido!").then(msg=>msg.delete({timeout: 5000}));

    this.divulgar(client, Discord, c, r, message.member.voice.channel, false, m);
}
    
    
module.exports.config = {
    name: 'divulgar',
    aliases: ["penalidades"],
    canal: ids.procurandoSala,
    staff: false,
    changelog: 'Codigo da partida não é mais obrigatório\n'+
               '↳ Nova opção: divulgar o Mapa (opcional)\n'+
               '↳ Mensagem de divulgar será apagada após dois minutos'
}