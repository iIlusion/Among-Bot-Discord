const ids = require('../../ids.json');
const JSONController = require('../../JSON/controller.js');
const ProfileController = require('../../controllers/profile-controller.js');

const completeList = JSONController.get('items');
module.exports.run = async function (client, message, args, config, Discord) {
    let id = message.mentions.members.first();
    id = id ? id.id : args[0];
    id = id ? id    : message.member.id;

    let itemList = '';
    const profile = ProfileController.getProfileOfId(id);
    let seen = [];
    if (!profile.items) profile.items = [];
    for (let item of profile.items)
        for (let realItem of completeList)
            if (item===realItem[0] && !seen.includes(realItem[0])) {
                seen.push(realItem[0])
                if (realItem[2]===-1)
                    itemList += `Nº ${realItem[0]}: ${client.emojis.cache.get(realItem[1])} (exclusivo)\n`;
                else
                    itemList += `Nº ${realItem[0]}: ${client.emojis.cache.get(realItem[1])} (${realItem[2]} 🪙)\n`;
                continue;
            }
    if (itemList === '')
        itemList = 'Ainda nada por aqui... Tente comprar itens pela loja: m!shop'
    else
        itemList += '\nPara usar um item, utilize: `m!profile use <Nº do item>`'

    const embedShop = new Discord.MessageEmbed()
    .setAuthor(`📦 | Inventário de ${message.member.displayName}`, `${message.author.displayAvatarURL({dynamic: true})}`)
    .setTitle(`Inventário`)
    .setColor("#f1fa8c")
    .setDescription(itemList)
    .setTimestamp()
    .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');
    return message.reply(embedShop)
}

module.exports.config = {
    name: 'itemlist',
    aliases: ['inventory', 'inventario', 'inventário', 'items', 'itens'],
    canal: ids.comandos,
    staff: false,
    changelog: "Lista items do seu inventário"
}