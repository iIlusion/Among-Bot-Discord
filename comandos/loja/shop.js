const ids = require('../../ids.json');
const JSONController = require('../../JSON/controller.js');

const itemsPerPage = 10;
const desc = '\nSe precisar filtrar, utilize `m!shop fundo/chapeu/traje/pet`.'
const completeList = JSONController.get('items');

function itemsForPage(type, client, embedShop) {
    let page = embedShop.page;
    const itemList = [];
    let curType = '';
    for (let i in completeList) 
        if (typeof completeList[i][0] === 'number') {
            if (type==='todos' || type===curType)
                itemList.push(completeList[i]);
        } else
            curType = completeList[i][0];
    
    const maxPage = Math.floor((parseInt(itemList.length)-1)/itemsPerPage);
    page = page < 0 ? maxPage : page;
    page = page > maxPage ? 0 : page
    embedShop.page = page;

    let items = '';
    for (let i = page*itemsPerPage; i < page*itemsPerPage+itemsPerPage && i <= itemList.length; i++) try {
        const item = itemList[i];
        if (typeof item[0] !== 'number') continue;
        if (item[2]===-1)
            items += `${client.emojis.cache.get(item[1])} \`EXCLUSIVO\`   ||\`m!buy ${item[1]}\`||\n`;
        else
            items += `${client.emojis.cache.get(item[1])}${pad(item[2])}\`${item[2]}\` 🪙    ||\`m!buy ${item[1]}\`||\n`;
    } catch (err) {}

    return maxPage!==-1 ? items + `\nPágina ${page+1}/${1+maxPage}` 
                        : 'Esta categoria não existe!\n';
}

function pad(number) {
    return "  ".repeat(5-(number.toString().length));
}

module.exports.run = async function (client, message, args, config, Discord) {
    const type = args[0] ? args[0]: 'todos';

    const embedShop = new Discord.MessageEmbed()
    .setAuthor(`💰 | Lojinha do lx`, `${message.author.displayAvatarURL({dynamic: true})}`)
    .setTitle(`Lista de cosméticos`)
    .setColor("#f1fa8c")
    .setTimestamp()
    .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');
    embedShop.page = 0;

    const items = itemsForPage(type, client, embedShop);
    embedShop.setDescription(items+desc);

    message.channel.send(embedShop).then(msg => {
        embedShop.message = msg;
        msg.react('⬅️');
        msg.react('➡️');
        collectReaction(embedShop, client, type, message.member);
    })
}

function collectReaction(embedShop, client, type, member) {
    const msg = embedShop.message;
    const filter = (reaction, user) => member.id===user.id;

    const collector = msg.createReactionCollector(filter, { time: 5*60*1000 }); // 5min timeout

    collector.on('collect', (reaction, user) => {
        let left = msg.reactions.cache.get('⬅️');
        let right = msg.reactions.cache.get('➡️');
        sum = 0;
        msg.reactions.cache.forEach(r=>{
            r.users.cache.forEach(user=>{
                if (!user.bot) {
                    'r.users.remove(user.id);'
                    sum = r.emoji.name==='⬅️' ? -1 : 1;
                }
            })
        });
        embedShop.page += sum;

        const items = itemsForPage(type, client, embedShop);
        embedShop.setDescription(items+desc);
        embedShop.message.edit(embedShop);
    });
}

module.exports.config = {
    name: 'shop',
    aliases: ['shopping'],
    canal: ids.comandos,
    staff: false,
    changelog: "Exibe todos os itens para comprar"
}