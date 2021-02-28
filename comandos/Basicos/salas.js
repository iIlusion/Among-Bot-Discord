const { MessageEmbed } = require("discord.js");
const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord, ids) {
    message.delete({timeout: 500})

    var embed = new Discord.MessageEmbed()
    const guild = message.guild;

    let jogadores = 0
    let category = guild.channels.cache.find(c => c.id === ids.partidanormal && c.type == "category")
    let category2 = guild.channels.cache.filter(c => c.parentID === ids.partidanormal && c.type == "voice") 
    let channels = category.children.sort().filter(c => c.type == "voice" && c.members.size < 10);
    let channels2 = category2.sort().filter(c => {
        jogadores += c.members.size
});
    if (!channels.size)
        embed.setDescription('**Sem salas disponíveis! contate um dos donos para que criem novas salas.**')

    embed.setTitle(`:busts_in_silhouette: | Atualmente temos ${jogadores} jogadores conectados.`)
    .setAuthor(`Naves Disponiveis`, 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png')
    .setColor('#C71110')
    .setTimestamp()
    .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');

    let checkSum = 0;

    let channelsArray = [];
    let channelsMap = channels.map(c => {
        return new Promise(resolve => {
            checkSum++;
            const vagas = 10 - c.members.size;
            atualizarArray(channelsArray, c, vagas, resolve)    
        });
    });

    Promise.all(channelsMap).then(()=>{
        while (checkSum%3!==0) {
            atualizarArray(channelsArray, '\u200b');
            checkSum++;
        }
    
        for (let field of channelsArray.sort())
            embed.addField(...field);
        message.channel.send(embed).then(msg=>msg.delete({timeout: 60*1000}))
    })
}

async function atualizarArray(array, canal, vagas, resolve){
    if (canal==='\u200b') {
        array.push([canal, canal, true]);
        return;
    }

    let code = '404';
    await canal.fetchInvites().then(invites=>{
        invites.forEach(i=> {
            if (i.maxUses===0 && i.maxAge===0)
                code = i.code;
        });
        array.push([canal.name, code === '404' ? `\`${vagas}\` vagas` : `\`${vagas} vagas \`[\`Entrar ⬅️\`](https://discord.gg/${code})`, true]);
        if (resolve) resolve();
    }).catch(err=>console.error);
}
    
    
module.exports.config = {
    name: 'salas',
    aliases: ["vagas"],
    canal: ids.procurandoSala,
    staff: false,
    changelog: "Tabela com salas será apagada após um minuto"
}