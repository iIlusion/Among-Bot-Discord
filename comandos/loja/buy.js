const ids = require('../../ids.json');
const JSONController = require('../../JSON/controller.js');
const ProfileController = require('../../controllers/profile-controller.js');

const completeList = JSONController.get('items');
module.exports.run = async function (client, message, args, config, Discord) {
    if (!args[0]) return message.reply('Utilize `m!shop` para ver a lista de itens para comprar!')  
    let profile = ProfileController.getProfileOfId(message.member.id);
    if (!profile.items) profile.items = [];

    for (let item of completeList)
        if (item[1]===args[0]) {
            if (profile.items.includes(item[0])) return message.reply('Você já comprou esse item!');
            if (item[2]===-1) return message.reply('Este item é exclusivo e não pode ser comprado.');
            const hasMoney = ProfileController.give(client, message.member, 0, -item[2])
            if (!hasMoney) return message.reply('Você não tem moedas suficientes para comprar este item!')
            profile = ProfileController.getProfileOfId(message.member.id);
            if (!profile.items) profile.items = [];
            profile.items.push(item[0]);
            ProfileController.saveProfile(message.member.id, profile);
            message.reply('Obrigado pela compra! Item adicionado ao seu inventário.');
            return;
        }
    return message.reply('Item não identificado! Verifique o código de barras e tente novamente.')
}

module.exports.config = {
    name: 'buy',
    aliases: ['shopping'],
    canal: ids.comandos,
    staff: false,
    changelog: "Compra um item da loja"
}