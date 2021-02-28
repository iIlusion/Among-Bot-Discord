const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord) {
    if (!message.member.roles.cache.has(ids.mudaePlayer)) {
        message.delete({timeout:500})
        return message.reply('Você não pode usar este comando pois não é um participante da competição.').then(msg=>msg.delete({timeout:5000}));
    }
    if (message.channel.id!=='788115659887214612'&&!ids.trocaWaifus.includes(message.channel.id)) {
        message.delete({timeout:500})
        return message.reply(`Este comando deve ser utilizado apenas nos canais ${ids.trocaWaifus.map(id=>`<#${id}>`).join(' e ')}!`).then(msg=>msg.delete({timeout:5000}));
    }

    const max = parseInt(args[0]);
    if (!max) {
        message.delete({timeout:500})
        return message.reply('Uso: `m!vender <valor max.>` (onde valor max. é o preço da waifu mais cara da troca)').then(msg=>msg.delete({timeout:5000}));
    }

    message.channel.send(`<:confirmar:775297614979268608> **Opções de troca permitidas**:
→ **Opção 1 ($givek)**: Minimo - \`${max}ka\` | Máximo - \`${max*2}ka\`
→ **Opção 2 ($me)**: Para trocar com a pessoa que tem a que vale **${max}** é necessário uma proposta (em personagens) de no mínimo **${parseInt(max*75/100)}** e no máximo **${max*2}**
→ **Opção 3 ($me + $givek)**: A pessoa que tem a que vale **${max}** deve pagar \`${parseInt(max*25/100)}ka\` e receber uma proposta (em personagens) de até **${parseInt(max*225/100)}**`);

}
    
module.exports.config = {
    name: 'vender',
    aliases: ['trocar'],
    canal: true,
    staff: false,
    changelog: "!"
}