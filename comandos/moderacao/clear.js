const Discord = require('discord.js');
const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord, ids) {
        if (!args[0]) return message.reply("Formato incorreto! Use: m!clear <1~100>");
        const qnt = parseInt(args[0]);
        if (qnt>100) return message.reply("Você só pode digitar um número de 1 à 100.")
        message.delete().then(()=>{
            const msgs = getMessages(message.channel, qnt);
            Promise.all([msgs]).then(all=>{
                const filtered = all[0].filter(msg => !msg.pinned);
                message.channel.bulkDelete(filtered);
                message.channel.send(`Chat limpo por ${message.member}`).then(msg => msg.delete({timeout:5000}));
            });
        });
}
    
module.exports.config = {
    name: 'clear',
    aliases: ["limpar"],
    staff: true,
    changelog: "!"
}

async function getMessages(channel, limit = 100) {
    let out = []
    if (limit <= 100) {
      let messages = await channel.messages.fetch({ limit: limit })
      out.push(...messages.array())
    } else {
      let rounds = (limit / 100) + (limit % 100 ? 1 : 0)
      let last_id = ""
      for (let x = 0; x < rounds; x++) {
        const options = {
          limit: 100
        }
        if (last_id.length > 0) {
          options.before = last_id
        }
        const messages = await channel.messages.fetch(options)
        out.push(...messages.array())
        last_id = messages.array()[(messages.array().length - 1)].id
      }
    }
    return out
  }